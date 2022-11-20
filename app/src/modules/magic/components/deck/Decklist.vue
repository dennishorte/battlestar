<template>
  <div class="deck-list">
    <div class="header">
      <div class="deck-name me-2">{{ deck.name }}</div>

      <div class="header-buttons">
        <button @click="openImportModal" class="btn btn-secondary btn-sm">import</button>
        <button @click="download" class="btn btn-secondary btn-sm">export</button>
        <button @click="openEditModal" class="btn btn-info btn-sm">edit</button>
        <button @click="save" :disabled="!modified" class="btn btn-warning btn-sm">save</button>
      </div>
    </div>

    <div class="deck-sections">
      <DecklistSection
        v-for="section in cardsBySection"
        :cards="section[1]"
        :name="section[0]"
      />
    </div>
  </div>

  <Modal id="deck-import-modal" @ok="importDecklist">
    <template #header>Import Deck</template>

    <div class="alert alert-danger">
      Using this option will overwrite the existing cards in this deck.
    </div>
    <textarea class="form-control" rows="15" ref="importText"></textarea>
  </Modal>

  <Modal id="edit-deck-modal" @ok="edit">
    <template #header>Edit Deck</template>
    <input class="form-control" v-model="newName" placeholder="name" />
    <input class="form-control" v-model="newPath" placeholder="path" />
  </Modal>
</template>


<script>
import { util } from 'battlestar-common'
import { saveAs } from 'file-saver'
import { mapState } from 'vuex'

import DecklistSection from './DecklistSection'
import Modal from '@/components/Modal'

import cardUtil from '../../util/cardUtil.js'


export default {
  name: 'Decklist',

  components: {
    DecklistSection,
    Modal,
  },

  data() {
    return {
      newName: '',
      newPath: '',

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
    ...mapState('magic/dm', {
      deck: 'activeDeck',
      modified: 'modified',
    }),

    cardsBySection() {
      const byZone = util.array.collect(this.deck.cardlist, card => card.zone)
      const mainByType = util.array.collect(byZone.main || [], card => cardUtil.getSortType(card.data))
      const orderedSections = Object
        .entries(mainByType)
        .sort((l, r) => cardUtil.sortTypes.indexOf(r[0]) - cardUtil.sortTypes.indexOf(l[0]))
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
            .collect(cards, card => cardUtil.createCardId(card))
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
    download() {
      const data = this.deck.decklist
      const blob = new Blob([data], { type: "text/plain;charset=utf-8" })
      saveAs(blob, `${this.deck.name}.txt`)
    },

    async edit() {
      this.deck.name = this.newName.trim()
      this.deck.path = this.newPath.trim()
      this.$store.commit('magic/dm/setDeckName', this.newName)
      this.$store.commit('magic/dm/setDeckPath', this.newPath)
      await this.$store.dispatch('magic/dm/saveActiveDeck')
      await this.$store.dispatch('magic/dm/fetchDecks')
    },

    importDecklist() {
      const text = this.$refs.importText.value
      this.$store.commit('magic/dm/setActiveDecklist', text)
    },

    openEditModal() {
      this.newName = this.deck.name
      this.newPath = this.deck.path
      this.$modal('edit-deck-modal').show()
    },

    openImportModal() {
      this.$modal('deck-import-modal').show()
    },

    async save() {
      this.$store.dispatch('magic/dm/saveActiveDeck')
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
</style>
