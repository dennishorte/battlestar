<template>
  <div class="card-name-full">
    <div class="card-name-full-inner" @click="closeup">
      <div class="card-name" :class="card.color">{{ name }}</div>
      <CardSquare :card="card" />
    </div>
  </div>
</template>


<script>
import CardSquare from './CardSquare'

export default {
  name: 'CardNameFull',

  components: {
    CardSquare,
  },

  inject: ['game'],

  props: {
    name: {
      type: String,
      required: true
    },
  },

  computed: {
    card() {
      return this.game.getCardByName(this.name)
    },
  },

  methods: {
    closeup(event) {
      event.stopPropagation()
      this.game.ui.modals.cardsViewer.title = ''
      this.game.ui.modals.cardsViewer.cards = [this.game.getCardByName(this.name)]
      this.$modal('cards-viewer-modal').show()
    },
  },
}
</script>


<style scoped>
.card-name-full {
  display: inline-block;
}

.card-name-full-inner {
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  overflow: hidden;
}

.card-name {
  border-top: 1px solid #7d6c50;
  border-left: 1px solid #7d6c50;
  border-bottom: 1px solid #7d6c50;
  max-height: 1.5em;
  margin-top: 1px;
  font-size: .9em;
  padding: 0 1px;
}
</style>
