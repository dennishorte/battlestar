<template>
  <ModalBase id="dune-tableau-modal">
    <template #header>{{ title }}</template>

    <template v-if="player">
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
    </template>
  </ModalBase>
</template>


<script>
import { h } from 'vue'
import DuneCard from '../DuneCard.vue'
import ModalBase from '@/components/ModalBase.vue'

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

  components: { ModalBase, TableauSection },

  inject: ['actor', 'game', 'ui'],

  computed: {
    player() {
      return this.ui.modals.tableau?.player || null
    },

    title() {
      return this.player ? `${this.player.name}'s tableau` : 'Tableau'
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
  },
}
</script>


<style scoped>
.stats {
  display: flex;
  flex-wrap: wrap;
  gap: .75em;
  font-size: .85em;
  color: #6a5a48;
  padding: 0 .25em .5em;
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
