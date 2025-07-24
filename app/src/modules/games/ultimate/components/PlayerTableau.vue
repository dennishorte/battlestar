<template>
  <div class="player-tableau">
    <div class="player-name">
      {{ player.name }}
    </div>

    <ColorStack
      v-for="color in game.utilColors()"
      :key="color"
      :player="player"
      :color="color"
    />

    <CardPile
      :zone="game.zones.byPlayer(player, 'artifact')"
      :expanded="true"
    />

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

    <CardPile
      :zone="game.zones.byPlayer(player, 'forecast')"
      :header="countHeader(player, 'forecast')"
    />

    <CardPile
      :zone="game.zones.byPlayer(player, 'safe')"
      :header="countHeader(player, 'safe')"
    />

    <CardPile
      :zone="game.zones.byPlayer(player, 'hand')"
      :header="countHeader(player, 'hand')"
      :expanded="actor.name === player.name"
    />
  </div>
</template>

<script>
import AchievementExtras from './AchievementExtras'
import CardPile from './CardPile'
import ColorStack from './ColorStack'
import ScoreExtras from './ScoreExtras'

export default {
  name: 'PlayerTableau',

  components: {
    AchievementExtras,
    CardPile,
    ColorStack,
    ScoreExtras,
  },

  inject: ['actor', 'game'],

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

    achievementsHeader(player) {
      return () => {
        const achievements = this.game.getAchievementsByPlayer(player)
        const count = achievements.total
        return `achievements ${count}`
      }
    },

    scoreHeader(player) {
      return () => {
        const count = this.game.zones.byPlayer(player, 'score').cardlist().length
        const total = this.game.getScore(player)
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
  align-content: center;
  flex-direction: column;

  position: sticky;
  top: 0;
  height: 2em;
  padding: 0, .25em;
  text-align: center;

  background-color: gray;
  color: white;
  font-size: 1.2em;

  max-width: 300px;
  border-radius: 0 0 .25em .25em;
}
</style>
