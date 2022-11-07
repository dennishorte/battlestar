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
    <input class="form-control" v-model="newDeckPath" placeholder="path" disabled />

    <DeckFolder v-if="root" :content="root" />
  </Modal>
</template>


<script>
import axios from 'axios'

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
      newDeckPath: '',
    }
  },

  computed: {
    ...mapState('magic/dm', {
      root: state => state.decks[0]
    }),
  },

  methods: {
    async createDeck() {
      const name = newDeckName.trim()
      const path = newDeckPath.trim()
      newDeckName = ''
      newDeckPath = ''

      if (name) {
        const deck = new magic.Deck.Deck()
        deck.userId = this.$store.getters['auth/user']._id
        deck.name = name
        deck.path = path
        const data = deck.serialize()
        const requestResult = await axios.post('/api/deck/insert', data)
        if (requestResult.data.status === 'success') {
          this.$store.dispatch('magic/dm/selectDeck', requestResult.data.deck)
          this.$store.dispatch('magic/dm/fetchDecks')
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
