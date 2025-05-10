<template>
  <div class="card-tableau">
    <div class="card-holder"
         v-for="card in cards"
         :key="card.g.id"
         @click="cardClicked(card)" >
      <Card :size="220" :card="card" :scrollable="cardScroll" />
      <div class="card-overlay" v-if="cannotDraft(card)"/>
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

  methods: {
    cannotDraft(card) {
      const player = this.game.getPlayerByName(this.actor.name)
      return card.g.id === player.scarredCardId
    },

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
