<template>
  <div class="deck-list" :class="modified ? 'modified' : ''">
    <div class="header">
      <div class="deck-name me-2">{{ deck.name }} ({{ deck.cardlist.length }})</div>

      <Dropdown class="deck-menu" v-if="!noMenu">
        <template #title>deck menu</template>

        <slot name="menu-options"></slot>
      </Dropdown>
    </div>

    <div class="deck-sections">
      <DecklistSection
        v-for="section in cardsBySection"
        :cards="section[1]"
        :name="section[0]"
        class="deck-section"
        @card-clicked="cardClicked"
      />
    </div>
  </div>
</template>


<script>
import { mag, util } from 'battlestar-common'
import { saveAs } from 'file-saver'
import { mapState } from 'vuex'

import DecklistSection from './DecklistSection'
import Dropdown from '@/components/Dropdown'


export default {
  name: 'Decklist',

  components: {
    DecklistSection,
    Dropdown,
  },

  props: {
    deck: Object,
    modified: {
      type: Boolean,
      default: false,
    },
    noMenu: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      sortTypes: [
        'creature',
        'planeswalker',
        'enchantment',
        'artifact',
        'instant',
        'sorcery',
        'other',
        'land',
      ],
    }
  },

  computed: {
    cardsBySection() {
      const byZone = util.array.collect(this.deck.cardlist, card => card.zone)
      const mainByType = util.array.collect(byZone.main || [], card => mag.util.card.getSortType(card.data))
      const orderedSections = Object
        .entries(mainByType)
        .sort((l, r) => mag.util.card.sortTypes.indexOf(r[0]) - mag.util.card.sortTypes.indexOf(l[0]))
      if (byZone.side) {
        orderedSections.push(['sideboard', byZone.side])
      }
      if (byZone.command) {
        orderedSections.push(['command', byZone.command])
      }

      const countedSections = orderedSections
        .map(([sectionName, cards]) => {
          const groups = util
            .array
            .collect(cards, card => mag.util.card.createCardId(card))
          const cardsWithCounts = Object
            .values(groups)
            .map(group => {
              const value = { ...group[0] }
              value.count = group.length
              return value
            })
          return [sectionName, cardsWithCounts]
        })

      return countedSections
    },
  },

  methods: {
    cardClicked(card) {
      this.$emit('card-clicked', card)
    },
  },
}
</script>


<style scoped>
.deck-list {
  display: flex;
  flex-direction: column;
  max-height: 100%;
  font-size: .8em;
}

.deck-name {
  font-size: 1.5em;
}

.deck-section {
  margin-left: 1em;
}

.deck-sections {
  display: flex;
  align-content: flex-start;
  max-height: 100%;
  flex-flow: column wrap;
}

.header {
  display: flex;
  flex-direction: row;
}

.header-buttons button {
  margin-left: .25em;
}

.modified {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='rgb(240, 180, 200)' font-size='20'>unsaved</text></svg>");
}
</style>
