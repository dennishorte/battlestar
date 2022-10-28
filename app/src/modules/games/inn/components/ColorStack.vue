<template>
  <div
    class="color-stack"
    @click="openCardsViewerModal"
  >
    <div class="color-stack-header" :class="[color]">
      <div>
        {{ zone.cards().length }} {{ zone.splay }}
      </div>

      <div class="biscuit-counts">

        <div class="biscuit-count-square color-biscuit-castle">
          {{ biscuits.k }}
        </div>
        <div class="biscuit-count-square color-biscuit-coin">
          {{ biscuits.c }}
        </div>
        <div class="biscuit-count-square color-biscuit-lightbulb">
          {{ biscuits.s }}
        </div>
        <div class="biscuit-count-square color-biscuit-leaf">
          {{ biscuits.l }}
        </div>
        <div class="biscuit-count-square color-biscuit-factory">
          {{ biscuits.f }}
        </div>
        <div class="biscuit-count-square color-biscuit-clock">
          {{ biscuits.i }}
        </div>

      </div>
    </div>

    <template v-for="card in cards" :key="card.id">
      <CardStacked :card="card" />
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
    biscuits() {
      const zone = this.game.getZoneByPlayer(this.player, this.color)
      return this.game.getBiscuitsByZone(zone)
    },

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
.biscuit-counts {
  display: flex;
  flex-direction: row;
  opacity: .4;
}

.biscuit-count-square {
  display: flex;
  justify-content: center;
  align-text: center;

  font-size: .9em;
  margin: 1px 0;
  color: #ddd;
  width: 1.2em;
}

.color-stack-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  margin-left: .5rem;
  margin-right: .5rem;
  margin-top: .25rem;
  padding: 0 .25rem;
  border-top: 1px solid #7d6c50;
  border-right: 1px solid #7d6c50;
  border-left: 1px solid #7d6c50;
  max-width: 284px;
}
</style>
