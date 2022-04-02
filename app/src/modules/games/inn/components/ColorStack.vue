<template>
  <div
    class="color-stack"
    @click="openCardsViewerModal"
  >
    <div class="color-stack-header" :class="[color]">
      {{ zone.cards().length }} {{ zone.splay }}
    </div>

    <template v-for="card in cards">
      <CardStacked :card="card" :key="card.id" />
    </template>

  </div>
</template>


<script>
import CardStacked from './CardStacked'

export default {
  name: 'ColorStack',

  components: {
    CardStacked,
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
      this.game.ui.modals.cardsViewer.title = this.color
      this.game.ui.modals.cardsViewer.cards = cards
      this.$bvModal.show('cards-viewer-modal')
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
  border-top: 1px solid #7d6c50;
  border-right: 1px solid #7d6c50;
  border-left: 1px solid #7d6c50;
  max-width: 284px;
}
</style>
