<template>
  <Modal class="modal-xl">
    <div class="modal-body">

      <div class="card-holder" v-for="card in cardData" :key="card.id">
        <Card :size="220" :card="card" />
      </div>

    </div>
  </Modal>
</template>


<script>
import { util } from 'battlestar-common'

import Card from '@/modules/magic/components/Card'
import Modal from '@/components/Modal'


export default {
  name: 'CardCloseupModal',

  components: {
    Card,
    Modal,
  },

  props: {
    cards: {
      type: Array,
      default: [],
    },
  },

  computed: {
    cardData() {
      if (this.cards.length === 0) {
        return []
      }
      else if (this.cards[0].card_faces) {
        return this.cards
      }
      else if (this.cards[0].data) {
        return this.cards.map(c => c.data)
      }
      else if (this.cards[0].name) {
        return this.cards.map(c => this.$store.getters['magic/cards/getLookupFunc'](c))
      }
    },
  },
}
</script>


<style scoped>
.card-holder {
  max-width: 100%;
  overflow-x: scroll;
  margin-left: .25em;
  margin-bottom: .25em;
}

.modal-body {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
