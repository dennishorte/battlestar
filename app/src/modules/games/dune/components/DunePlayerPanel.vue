<template>
  <div class="player-panel">
    <div class="header" :style="{ 'background-color': player.color }">
      {{ player.name }}
      <span class="vp-badge">{{ player.vp }} VP</span>
    </div>

    <div class="body">
      <div class="resources">
        <span class="resource" title="Solari">{{ player.solari }} sol</span>
        <span class="resource" title="Spice">{{ player.spice }} spi</span>
        <span class="resource" title="Water">{{ player.water }} wat</span>
      </div>

      <div class="units">
        <span title="Available Agents">{{ player.availableAgents }} agents</span>
        <span title="Troops in Garrison">{{ player.troopsInGarrison }} garrison</span>
        <span title="Troops in Supply">{{ player.troopsInSupply }} supply</span>
        <span title="Spies in Supply">{{ player.spiesInSupply }} spies</span>
      </div>

      <div class="influence-row">
        <span class="influence inf-emperor" title="Emperor">E:{{ player.getInfluence('emperor') }}</span>
        <span class="influence inf-guild" title="Spacing Guild">G:{{ player.getInfluence('guild') }}</span>
        <span class="influence inf-bg" title="Bene Gesserit">BG:{{ player.getInfluence('bene-gesserit') }}</span>
        <span class="influence inf-fremen" title="Fremen">F:{{ player.getInfluence('fremen') }}</span>
      </div>

      <div class="deck-info">
        <span>deck: {{ deckCount }}</span>
        <span>discard: {{ discardCount }}</span>
        <span>intrigue: {{ intrigueCount }}</span>
        <span v-if="player.strength > 0">strength: {{ player.strength }}</span>
        <span v-if="player.hasHighCouncil">high council</span>
      </div>
    </div>

    <div class="hand" v-if="isViewer && hand.length > 0">
      <div class="section-label">Hand</div>
      <DuneCard v-for="card in hand" :key="card.id" :card="card" />
    </div>

    <div class="played" v-if="playedCards.length > 0">
      <div class="section-label">Played</div>
      <DuneCard v-for="card in playedCards" :key="card.id" :card="card" />
    </div>

    <div class="revealed" v-if="revealedCards.length > 0">
      <div class="section-label">Revealed</div>
      <DuneCard v-for="card in revealedCards" :key="card.id" :card="card" />
    </div>
  </div>
</template>


<script>
import DuneCard from './DuneCard.vue'

export default {
  name: 'DunePlayerPanel',

  components: { DuneCard },

  inject: ['actor', 'game'],

  props: {
    player: {
      type: Object,
      required: true,
    },
  },

  computed: {
    isViewer() {
      return this.player.name === this.actor.name
    },

    hand() {
      return this.game.zones.byId(`${this.player.name}.hand`).cardlist()
        .sort((l, r) => l.name.localeCompare(r.name))
    },

    playedCards() {
      return this.game.zones.byId(`${this.player.name}.played`).cardlist()
    },

    revealedCards() {
      return this.game.zones.byId(`${this.player.name}.revealed`).cardlist()
    },

    deckCount() {
      return this.game.zones.byId(`${this.player.name}.deck`).cardlist().length
    },

    discardCount() {
      return this.game.zones.byId(`${this.player.name}.discard`).cardlist().length
    },

    intrigueCount() {
      return this.game.zones.byId(`${this.player.name}.intrigue`).cardlist().length
    },
  },
}
</script>


<style scoped>
.player-panel {
  margin-bottom: .5em;
  border: 1px solid #3d2e1a;
  border-radius: .3em;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .25em .5em;
  font-weight: bold;
  color: white;
}

.vp-badge {
  background-color: rgba(0, 0, 0, 0.3);
  padding: .1em .4em;
  border-radius: .2em;
  font-size: .9em;
}

.body {
  padding: .4em .5em;
  display: flex;
  flex-direction: column;
  gap: .25em;
}

.resources {
  display: flex;
  gap: .75em;
  font-weight: 600;
}

.units {
  display: flex;
  gap: .5em;
  font-size: .85em;
  color: #b8a888;
}

.influence-row {
  display: flex;
  gap: .5em;
}

.influence {
  padding: .05em .3em;
  border-radius: .15em;
  font-size: .85em;
  font-weight: 600;
}

.inf-emperor { background-color: #5a1515; }
.inf-guild { background-color: #6a4010; }
.inf-bg { background-color: #3a2060; }
.inf-fremen { background-color: #1a4060; }

.deck-info {
  display: flex;
  gap: .5em;
  font-size: .8em;
  color: #8a7a68;
}

.section-label {
  font-size: .75em;
  text-transform: uppercase;
  color: #8a7a68;
  padding: .2em .5em 0;
}

.hand, .played, .revealed {
  padding: 0 .3em .3em;
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}
</style>
