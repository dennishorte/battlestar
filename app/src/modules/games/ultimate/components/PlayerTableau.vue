<template>
  <div class="player-tableau">
    <div class="player-name">
      {{ player.name }}
      <span class="draw-info" :class="`draw-${nextDraw.exp}`">
        {{ nextDraw.age }} {{ nextDraw.exp }}
      </span>
    </div>

    <ColorStack
      v-for="color in game.util.colors()"
      :key="color"
      :player="player"
      :color="color"
    />

    <template v-if="game.getExpansionList().includes('arti')">
      <CardPile
        :zone="game.zones.byPlayer(player, 'artifact')"
        :expanded="true"
      />

      <CardPile
        :zone="game.zones.byPlayer(player, 'museum')"
        :expanded="true"
      />
    </template>

    <CardPile
      :zone="game.zones.byPlayer(player, 'achievements')"
      :header="achievementsHeader(player)"
    >
      <AchievementExtras :player="player" />
    </CardPile>

    <CardPile
      :zone="game.zones.byPlayer(player, 'score')"
      :header="scoreHeader(player)"
    >
      <ScoreExtras :player="player" />
    </CardPile>

    <template v-if="game.getExpansionList().includes('echo') || game.getExpansionList().includes('figs')">
      <CardPile
        :zone="game.zones.byPlayer(player, 'forecast')"
        :header="countWithLimitHeader(player, 'forecast')"
      />
    </template>

    <template v-if="game.getExpansionList().includes('usee')">
      <CardPile
        :zone="game.zones.byPlayer(player, 'safe')"
        :header="countWithLimitHeader(player, 'safe')"
      />
    </template>

    <CardPile
      :zone="game.zones.byPlayer(player, 'hand')"
      :header="countHeader(player, 'hand')"
      :expanded="actor.name === player.name"
    />
  </div>
</template>

<script>
import AchievementExtras from './AchievementExtras.vue'
import CardPile from './CardPile.vue'
import ColorStack from './ColorStack.vue'
import ScoreExtras from './ScoreExtras.vue'

export default {
  name: 'PlayerTableau',

  components: {
    AchievementExtras,
    CardPile,
    ColorStack,
    ScoreExtras,
  },

  inject: ['actor', 'game'],

  computed: {
    nextDraw() {
      return this.game.getNextDrawDeck(this.player)
    },
  },

  props: {
    player: {
      type: Object,
      required: true
    },
  },

  methods: {
    countHeader(player, zoneName) {
      return () => {
        const count = this.game.zones.byPlayer(player, zoneName).cardlist().length
        return `${zoneName} ${count}`
      }
    },

    countWithLimitHeader(player, zoneName) {
      return () => {
        const count = this.game.zones.byPlayer(player, zoneName).cardlist().length
        const maximum = player.zoneLimit()
        return `${zoneName} ${count}/${maximum}`
      }
    },

    achievementsHeader(player) {
      return () => {
        const achievements = player.achievementCount()
        const count = achievements.total
        const target = this.game.getNumAchievementsToWin()
        return `achievements ${count}/${target}`
      }
    },

    scoreHeader(player) {
      return () => {
        const count = this.game.zones.byPlayer(player, 'score').cardlist().length
        const total = player.score()
        return `score ${count} [${total}]`
      }
    }
  },
}
</script>


<style scoped>
.player-name {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  position: sticky;
  top: 0;
  height: 2em;
  padding: 0 .25em;
  text-align: center;

  background-color: gray;
  color: white;
  font-size: 1.2em;

  max-width: 300px;
  border-radius: 0 0 .25em .25em;
}

.draw-info {
  position: absolute;
  right: 0.4em;
  font-size: 0.7em;
}

.draw-base { color: #ffe0a0; }
.draw-echo { color: #a0c0ff; }
.draw-figs { color: #80d060; }
.draw-arti { color: #d090f0; }
.draw-usee { color: #d0d0d0; }
</style>
