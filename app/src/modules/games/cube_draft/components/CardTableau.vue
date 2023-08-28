<template>
  <div class="card-tableau">
    <div class="card-holder" v-for="card in cards" :key="card.id" @click="cardClicked(card)" >
      <Card :size="220" :card="card.data" :scrollable="cardScroll" />
      <div class="card-overlay" v-if="cannotDraft(card)"></div>
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

  inject: ['actor', 'game'],

  watch: {
    cards(newValue) {
      this.ensureData(newValue)
    },
  },

  methods: {
    cannotDraft(card) {
      const player = this.game.getPlayerByName(this.actor.name)
      return card.id === player.scarredCardId
    },

    cardClicked(card) {
      this.$emit('card-clicked', card)
    },

    ensureData(cards) {
      for (const card of cards) {
        if (!card.data) {
          card.data = this.$store.getters['magic/cards/getLookupFunc'](card)
        }
      }
    },
  },

  mounted() {
    this.ensureData(this.cards)
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
  position: relative;
  max-width: 100%;
  overflow-x: scroll;
  margin-left: .25em;
  margin-bottom: .25em;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: .5em;
}
</style>
