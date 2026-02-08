<template>
  <div class="card-tableau">
    <div class="card-holder"
         v-for="card in cards"
         :key="card.id"
         @click="cardClicked(card)" >
      <div class="card-display" @click="showDraftModal = true">
        <MagicCard
          :size="220"
          :card="card"
          :scrollable="cardScroll"
          :disabled="cannotDraft(card)" />
      </div>
      <div class="card-overlay">
        <span class="card-overlay-text">You just scarred this card</span>
      </div>
    </div>
  </div>
</template>


<script>
import MagicCard from '@/modules/magic/components/card/MagicCard.vue'


export default {
  name: 'CardTableau',

  components: {
    MagicCard,
  },

  emits: ['card-clicked'],

  props: {
    cards: {
      type: Array,
      default: () => [],
    },

    cardScroll: {
      type: Boolean,
      default: true,
    },
  },

  inject: ['actor', 'game'],

  methods: {
    cannotDraft(card) {
      const player = this.game.players.byName(this.actor.name)
      return !player.canDraft(card)
    },

    cardClicked(card) {
      if (this.cannotDraft(card)) {
        return
      }
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
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 11;
}

.card-overlay-text {
  color: #fff;
  font-size: .85em;
  font-weight: 600;
  text-align: center;
  padding: .5em;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}
</style>
