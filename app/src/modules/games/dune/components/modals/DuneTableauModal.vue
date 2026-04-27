<template>
  <teleport to="body">
    <div v-if="player" class="dune-modal-backdrop" @click="close">
      <div class="dune-modal tableau-modal" @click.stop>
        <div class="modal-title">
          {{ player.name }}'s tableau
          <span class="close-x" @click="close">×</span>
        </div>

        <div class="stats">
          <span>{{ player.vp }} VP</span>
          <span>{{ player.solari }} solari</span>
          <span>{{ player.spice }} spice</span>
          <span>{{ player.water }} water</span>
        </div>

        <div class="sections">
          <TableauSection :title="deckTitle" :cards="deckCards" />
          <TableauSection v-if="isOwner" title="Hand + Played" :cards="handPlayed" />
          <TableauSection v-else title="Played" :cards="playedCards" />
          <TableauSection v-if="revealedCards.length" title="Revealed" :cards="revealedCards" />
          <TableauSection title="Discard" :cards="discardCards" />
          <TableauSection :title="intrigueTitle" :cards="intrigueCards" :hidden-count="intrigueHiddenCount" />
          <TableauSection v-if="contractCards.length" title="Contracts" :cards="contractCards" />
          <TableauSection v-if="completedContractCards.length"
                          title="Completed Contracts"
                          :cards="completedContractCards" />
        </div>
      </div>
    </div>
  </teleport>
</template>


<script>
import { h } from 'vue'
import DuneCard from '../DuneCard.vue'

const TableauSection = {
  name: 'TableauSection',
  props: {
    title: { type: String, required: true },
    cards: { type: Array, default: () => [] },
    hiddenCount: { type: Number, default: null },
  },
  render() {
    const children = []
    children.push(h('div', { class: 'section-title' }, [
      this.title,
      h('span', { class: 'section-count' },
        this.hiddenCount !== null ? `${this.hiddenCount}` : `${this.cards.length}`),
    ]))

    if (this.hiddenCount !== null) {
      children.push(h('div', { class: 'section-hidden' },
        this.hiddenCount === 0 ? 'none' : `${this.hiddenCount} card${this.hiddenCount === 1 ? '' : 's'} (hidden)`))
    }
    else if (this.cards.length === 0) {
      children.push(h('div', { class: 'section-empty' }, 'none'))
    }
    else {
      for (const card of this.cards) {
        children.push(h(DuneCard, { key: card.id || card.name, card }))
      }
    }
    return h('div', { class: 'section' }, children)
  },
}


export default {
  name: 'DuneTableauModal',

  components: { TableauSection },

  inject: ['actor', 'game', 'ui'],

  computed: {
    player() {
      return this.ui.modals.tableau?.player || null
    },

    isOwner() {
      return this.player && this.player.name === this.actor.name
    },

    deckCards() {
      if (!this.player) {
        return []
      }
      const sortByName = (l, r) => l.name.localeCompare(r.name)
      if (this.isOwner) {
        return this.zone('deck').slice().sort(sortByName)
      }
      return [...this.zone('deck'), ...this.zone('hand')].sort(sortByName)
    },

    deckTitle() {
      if (!this.player) {
        return 'Deck'
      }
      if (this.isOwner) {
        return 'Deck'
      }
      return 'Deck + Hand'
    },

    handPlayed() {
      const sortByName = (l, r) => l.name.localeCompare(r.name)
      return [...this.zone('hand'), ...this.zone('played')].sort(sortByName)
    },

    playedCards() {
      return this.zone('played').slice().sort((l, r) => l.name.localeCompare(r.name))
    },

    revealedCards() {
      return this.zone('revealed').slice().sort((l, r) => l.name.localeCompare(r.name))
    },

    discardCards() {
      return this.zone('discard').slice().sort((l, r) => l.name.localeCompare(r.name))
    },

    intrigueTitle() {
      return 'Intrigue'
    },

    intrigueCards() {
      if (!this.player) {
        return []
      }
      if (this.isOwner) {
        return this.zone('intrigue').slice().sort((l, r) => l.name.localeCompare(r.name))
      }
      return []
    },

    intrigueHiddenCount() {
      if (!this.player || this.isOwner) {
        return null
      }
      return this.zone('intrigue').length
    },

    contractCards() {
      return this.zone('contracts').slice().sort((l, r) => l.name.localeCompare(r.name))
    },

    completedContractCards() {
      return this.zone('contractsCompleted').slice().sort((l, r) => l.name.localeCompare(r.name))
    },
  },

  methods: {
    zone(name) {
      if (!this.player) {
        return []
      }
      const zone = this.game.zones.byId(`${this.player.name}.${name}`)
      return zone ? zone.cardlist() : []
    },

    close() {
      this.ui.modals.tableau = null
    },
  },
}
</script>


<style scoped>
.dune-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.dune-modal {
  background: white;
  border-radius: .5em;
  min-width: 300px;
  max-width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, .3);
}

.tableau-modal {
  max-width: 560px;
  max-height: 85vh;
  overflow-y: auto;
  padding: .75em;
  display: flex;
  flex-direction: column;
  gap: .5em;
}

.modal-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 1.1em;
  padding: 0 .25em .25em;
  border-bottom: 1px solid #e0d8c4;
  color: #2c2416;
}

.close-x {
  cursor: pointer;
  font-size: 1.4em;
  line-height: 1;
  color: #8a7a68;
  padding: 0 .25em;
}

.close-x:hover {
  color: #2c2416;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: .75em;
  font-size: .85em;
  color: #6a5a48;
  padding: 0 .25em;
}

.sections {
  display: flex;
  flex-direction: column;
  gap: .4em;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.section :deep(.section-title) {
  font-size: .8em;
  text-transform: uppercase;
  color: #6a5a48;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  padding: .25em .25em 0;
  border-top: 1px solid #efe8db;
}

.section :deep(.section-count) {
  color: #8a7a68;
  font-weight: 400;
}

.section :deep(.section-empty),
.section :deep(.section-hidden) {
  font-size: .85em;
  color: #8a7a68;
  font-style: italic;
  padding: .15em .5em .25em;
}

.section :deep(.dune-card) {
  border: 1px solid #d4c8a8;
  font-size: .9em;
  padding: .4em .6em;
}
</style>
