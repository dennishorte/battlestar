<template>
  <div class="player-panel">
    <div class="header clickable" :style="{ 'border-color': player.color }" @click="openTableau">
      <div class="header-left">
        <div class="header-top-row">
          {{ player.name }}
          <span class="first-player" v-if="isFirstPlayer" title="First Player">1st</span>
          <i class="bi bi-card-list tableau-icon" title="View tableau" />
        </div>
        <DuneOptionChip v-if="leader"
                        :name="leader.name"
                        :leader="leader"
                        :feyd-position="feydPosition"
                        class="leader-chip" />
      </div>
      <span class="objective" v-if="objective" :title="objective.name">
        {{ battleIconLabel(objective.battleIcon) }}
      </span>
      <span class="vp-badge">{{ player.vp }} VP</span>
    </div>

    <div class="body">
      <div class="resources">
        <span class="resource" title="Solari">{{ player.solari }} solari</span>
        <span class="resource" title="Spice">{{ player.spice }} spice</span>
        <span class="resource" title="Water">{{ player.water }} water</span>
      </div>

      <div class="units">
        <span title="Available Agents">{{ player.availableAgents }} agents</span>
        <span title="Troops in Garrison">{{ player.troopsInGarrison }} garrison</span>
        <span title="Troops in Supply">{{ player.troopsInSupply }} supply</span>
        <span title="Spies in Supply">{{ player.spiesInSupply }} spies</span>
      </div>

      <div class="deck-info">
        <span>hand: {{ handCount }}</span>
        <span>deck: {{ deckCount }}</span>
        <span>discard: {{ discardCount }}</span>
        <span :class="{ clickable: isViewer }" @click="openIntrigue">intrigue: {{ intrigueCount }}</span>
        <span class="clickable" @click="openContracts">contracts: {{ contractsCount }}</span>
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

    <div class="reserved" v-if="reservedCards.length > 0">
      <div class="section-label">
        Reserved <span class="reserved-badge">Manipulate · -1 Persuasion</span>
      </div>
      <DuneCard v-for="card in reservedCards" :key="card.id" :card="card" />
    </div>
  </div>
</template>


<script>
import DuneCard from './DuneCard.vue'
import DuneOptionChip from './DuneOptionChip.vue'

export default {
  name: 'DunePlayerPanel',

  components: { DuneCard, DuneOptionChip },

  inject: ['actor', 'game', 'ui'],

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

    isFirstPlayer() {
      const allPlayers = this.game.players.all()
      return allPlayers[this.game.state.firstPlayerIndex]?.name === this.player.name
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

    handCount() {
      return this.game.zones.byId(`${this.player.name}.hand`).cardlist().length
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

    contractsCount() {
      return this.game.zones.byId(`${this.player.name}.contracts`).cardlist().length
    },

    leader() {
      return this.game.state.leaders[this.player.name] || null
    },

    objective() {
      return this.game.state.objectives[this.player.name] || null
    },

    feydPosition() {
      return this.game.state.feydTrack?.[this.player.name] || null
    },

    reservedCards() {
      const reservations = this.game.state.reservedCards || []
      const myCardIds = new Set(
        reservations
          .filter(r => r.player === this.player.name)
          .map(r => r.cardId)
      )
      if (myCardIds.size === 0) {
        return []
      }
      return this.game.zones.byId('common.reservedCards')
        .cardlist()
        .filter(c => myCardIds.has(c.id))
    },
  },

  methods: {
    openTableau() {
      this.ui.modals.tableau = { player: this.player }
      this.$modal('dune-tableau-modal').show()
    },

    openIntrigue() {
      if (!this.isViewer) {
        return
      }
      const cards = this.game.zones.byId(`${this.player.name}.intrigue`).cardlist()
        .sort((l, r) => l.name.localeCompare(r.name))
      this.ui.modals.cardList = {
        title: `${this.player.name} — Intrigue`,
        cards,
      }
      this.$modal('dune-card-list-modal').show()
    },

    openContracts() {
      const cards = this.game.zones.byId(`${this.player.name}.contracts`).cardlist()
        .sort((l, r) => l.name.localeCompare(r.name))
      this.ui.modals.cardList = {
        title: `${this.player.name} — Contracts`,
        cards,
      }
      this.$modal('dune-card-list-modal').show()
    },

    battleIconLabel(icon) {
      const labels = {
        'desert-mouse': '🐭',
        crysknife: '🗡',
        ornithopter: '🦅',
        wild: '★',
      }
      return labels[icon] || icon
    },
  },
}
</script>


<style scoped>
.player-panel {
  margin-bottom: .5em;
  border: 1px solid #d4c8a8;
  border-radius: .3em;
  overflow: hidden;
  background-color: white;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .25em .5em;
  font-weight: bold;
  color: #2c2416;
  border-bottom: 3px solid;
}

.header.clickable {
  cursor: pointer;
}

.header.clickable:hover .tableau-icon {
  color: #2c2416;
}

.tableau-icon {
  font-size: .85em;
  color: #8a7a68;
  margin-left: .15em;
}

.first-player {
  background-color: #8b6914;
  color: white;
  padding: .05em .35em;
  border-radius: .2em;
  font-size: .75em;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: .1em;
}

.header-top-row {
  display: flex;
  align-items: center;
  gap: .3em;
}

.leader-chip {
  font-size: .8em;
}

.objective {
  font-size: 1.1em;
  margin-left: auto;
}

.vp-badge {
  background-color: #8b6914;
  color: white;
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
  color: #2c2416;
}

.units {
  display: flex;
  gap: .5em;
  font-size: .85em;
  color: #6a5a48;
}

.deck-info {
  display: flex;
  flex-wrap: wrap;
  gap: .5em;
  font-size: .8em;
  color: #8a7a68;
}

.deck-info .clickable {
  cursor: pointer;
  color: #6a5010;
  text-decoration: underline dotted;
}

.deck-info .clickable:hover {
  color: #2c2416;
}

.section-label {
  font-size: .75em;
  text-transform: uppercase;
  color: #8a7a68;
  padding: .2em .5em 0;
}

.hand, .played, .revealed, .reserved {
  padding: 0 .3em .3em;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.reserved-badge {
  display: inline-block;
  margin-left: .35em;
  padding: .05em .35em;
  border-radius: .2em;
  background-color: #6a3d8a;
  color: white;
  font-size: .9em;
  font-weight: 600;
  text-transform: none;
}
</style>
