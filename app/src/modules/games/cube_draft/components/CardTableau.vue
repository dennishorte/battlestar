<template>
  <div class="card-tableau">
    <div class="card-holder" v-for="card in cards" :key="card.id">
      <Card :size="220" :card="card.data" @click="cardClicked(card)" :scrollable="cardScroll" />
    </div>
  </div>
</template>


<script>
import { util } from 'battlestar-common'

import Card from '@/modules/magic/components/Card'
import Modal from '@/components/Modal'


export default {
  name: 'CardTableau',

  components: {
    Card,
    Modal,
  },

  props: {
    cards: {
      type: Array,
      default: [],
    },

    cardScroll: {
      type: Boolean,
      default: true,
    },
  },

  watch: {
    cards(newValue, oldValue) {
      for (const card of newValue) {
        if (!card.data) {
          card.data = this.$store.getters['magic/cards/getLookupFunc'](card)
        }
      }
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
.card-tableau {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.card-holder {
  max-width: 100%;
  overflow-x: scroll;
  margin-left: .25em;
  margin-bottom: .25em;
}
</style>
