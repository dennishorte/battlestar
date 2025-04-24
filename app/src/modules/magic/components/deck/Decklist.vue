<template>
  <div class="deck-list" :class="deck.isModified() ? 'modified' : ''">
    <div class="header">
      <Dropdown class="deck-menu">
        <template #title>deck menu</template>

        <DropdownButton @click="setEditMode('build')">edit mode: build</DropdownButton>
        <DropdownButton @click="setEditMode('sideboard')">edit mode: sideboard</DropdownButton>
        <DropdownDivider />

        <slot name="menu-options"></slot>
      </Dropdown>

      <div class="deck-name me-2">{{ deck.name }} ({{ maindeckSize }})</div>
    </div>

    <div class="deck-sections">
      <DecklistSection
        v-for="section in Object.entries(deck.cardIdsByZone)"
        :cards="section[1]"
        :name="section[0]"
        class="deck-section"
        @card-clicked="cardClicked"
      />
    </div>
  </div>
</template>


<script>
// import { saveAs } from 'file-saver'
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
    maindeckSize() {
      return this.deck.cardIdsByZone['main'].length
    },
  },

  methods: {
    cardClicked(payload) {
      this.$emit('card-clicked', payload)
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
