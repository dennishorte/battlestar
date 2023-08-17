<template>
  <div class="deck-list" :class="modified ? 'modified' : ''">
    <div class="header">
      <Dropdown class="deck-menu" v-if="!noMenu">
        <template #title>deck menu</template>

        <!-- <DropdownButton @click="setViewType('card-type')">view: card type</DropdownButton>
             <DropdownButton @click="setViewType('mana-cost')">view: mana cost</DropdownButton>
             <DropdownDivider />
        -->

        <DropdownButton @click="setEditMode('build')">edit mode: build</DropdownButton>
        <DropdownButton @click="setEditMode('sideboard')">edit mode: sideboard</DropdownButton>
        <DropdownDivider />


        <slot name="menu-options"></slot>
      </Dropdown>

      <div class="deck-name me-2">{{ deck.name }} ({{ maindeckSize }})</div>
      <div class="edit-mode">mode: {{ editMode }}</div>
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
import DropdownButton from '@/components/DropdownButton'
import DropdownDivider from '@/components/DropdownDivider'


export default {
  name: 'Decklist',

  components: {
    DecklistSection,
    Dropdown,
    DropdownButton,
    DropdownDivider,
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
    defaultEditMode: {
      type: String,
      default: 'sideboard',
    },
  },

  data() {
    return {
      sortTypes: [
        'command',
        'creature',
        'planeswalker',
        'enchantment',
        'artifact',
        'instant',
        'sorcery',
        'other',
        'land',
        'sideboard',
      ],

      viewType: 'card-type',
    }
  },

  computed: {
    ...mapState('magic/dm', {
      editMode: 'editMode',
    }),

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
            .collect(cards, card => mag.util.card.createCardIdString(card))
          const cardsWithCounts = Object
            .values(groups)
            .map(group => {
              const value = { ...group[0] }
              value.count = group.length
              return value
            })
            .sort((l, r) => {
              if (l.data.cmc !== r.data.cmc) {
                return l.data.cmc - r.data.cmc
              }
              else {
                return l.name.localeCompare(r.name)
              }
            })
          return [sectionName, cardsWithCounts]
        })
        .sort((l, r) => this.sortTypes.indexOf(l[0]) - this.sortTypes.indexOf(r[0]))

      return countedSections
    },

    maindeckSize() {
      return this.deck.cardlist.filter(card => card.zone === 'main').length
    },
  },

  methods: {
    cardClicked(card) {
      this.$emit('card-clicked', card)
    },

    setEditMode(modeName) {
      this.$store.commit('magic/dm/setEditMode', modeName)
    },

    setViewType(typeName) {
      this.viewType = typeName
      console.log(this.viewType)
    },
  },

  mounted() {
    this.setEditMode(this.defaultEditMode)
  },
}
</script>


<style scoped>
.deck-list {
  display: flex;
  flex-direction: column;
  max-height: 100%;
  font-size: .8em;
  margin-bottom: 4em;
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
  flex-direction: column;
}

.header-buttons button {
  margin-left: .25em;
}

.modified {
  background-color: rgb(240, 180, 200);
}
</style>
