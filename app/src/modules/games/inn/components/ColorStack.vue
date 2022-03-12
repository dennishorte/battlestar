<template>
  <div
    class="color-stack"
    @click="openCardsViewerModal"
  >
    <div class="color-stack-header" :class="[color]">
      {{ zone.cards().length }} {{ zone.splay }}
    </div>

    <template v-for="card in cards">
      <CardFull :card="card" :key="card.id" v-if="hasVisibleEffect(card)" />
    </template>

  </div>
</template>


<script>
import CardFull from './CardFull'

export default {
  name: 'ColorStack',

  components: {
    CardFull,
  },

  inject: ['game'],

  props: {
    player: Object,
    color: String,
  },

  computed: {
    cards() {
      return this.zone.cards()
    },

    zone() {
      return this.game.getZoneByPlayer(this.player, this.color)
    },
  },

  methods: {
    openCardsViewerModal() {
      const cards = this.game.getCardsByZone(this.player, this.color)
      this.game.ui.modals.cardsViewer.cards = cards
      this.$bvModal.show('cards-viewer-modal')
    },

    hasVisibleEffect(card) {
      return (
        this.game.checkCardIsTop(card)
        || this.game.checkEffectIsVisible(card)
        || this.game.checkInspireIsVisible(card)
      )
    },
  }
}
</script>

<style scoped>
.color-stack-header {
  margin-left: .5rem;
  margin-right: .5rem;
  margin-top: .25rem;
  padding-left: .25rem;
  border-top: 1px solid black;
  border-right: 1px solid black;
  border-left: 1px solid black;
}
</style>
