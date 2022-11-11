<template>
  <div class="deck-selector">
    <SectionHeader>
      <div class="header-content">
        <div>Deck Selector</div>
        <div class="icons">
          <i class="bi-files"></i>&nbsp;
          <i class="bi-plus-square" @click="newDeckModal"></i>&nbsp;
          <i class="bi-pencil-square"></i>
        </div>
      </div>
    </SectionHeader>

    <DeckFolder v-if="root" :content="root" />

  </div>

  <Modal id="new-deck-modal" @ok="createDeck">
    <template #header>New Deck</template>
    <input class="form-control" v-model="newDeckName" placeholder="name" />
    <input class="form-control" :value="newDeckPath" placeholder="path" disabled />

    <DeckFolder v-if="root" :content="root" />
  </Modal>
</template>


<script>
import axios from 'axios'

import { mag } from 'battlestar-common'
import { mapState } from 'vuex'

import DeckFolder from './DeckFolder'
import Modal from '@/components/Modal'
import SectionHeader from '@/components/SectionHeader'


export default {
  name: 'DeckSelector',

  components: {
    DeckFolder,
    Modal,
    SectionHeader,
  },

  data() {
    return {
      newDeckName: '',
    }
  },

  computed: {
    ...mapState('magic/dm', {
      activeDeck: 'activeDeck',
      activeFolder: 'activeFolder',
      root: state => state.decks[0],
    }),

    newDeckPath() {
      if (this.activeFolder) {
        return this.activeFolder
      }
      else if (this.activeDeck) {
        return this.activeDeck.path
      }
      else {
        return '/'
      }
    },
  },

  methods: {
    async createDeck() {
      const name = this.newDeckName.trim()
      const path = this.newDeckPath.trim()
      this.newDeckName = ''

      if (name) {
        const deck = new mag.Deck.Deck()
        deck.userId = this.$store.getters['auth/user']._id
        deck.name = name
        deck.path = path
        const data = deck.serialize()

        const requestResult = await axios.post('/api/deck/create', data)
        if (requestResult.data.status === 'success') {
          await this.$store.dispatch('magic/dm/fetchDecks')
          this.$store.dispatch('magic/dm/selectDeckByPath', {
            path: requestResult.data.deck.path,
            name: requestResult.data.deck.name,
          })
        }
      }
    },

    newDeckModal() {
      this.$modal('new-deck-modal').show()
    },
  },
}
</script>


<style scoped>
.header-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.icons {
  display: flex;
  flex-direction: row;
}
</style>
