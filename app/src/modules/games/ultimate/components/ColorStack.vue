<template>
  <div
    class="color-stack"
    @click="openCardsViewerModal"
  >
    <div class="color-stack-header" :class="[color]">
      <div class="card-splay">
        {{ zone.cardlist().length }}
        {{ zone.splay }}
      </div>

      <div class="hex-count-container">
        <span class="hex-count-text">
          {{ hexes.length }}
        </span>
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
        <div class="biscuit-count-square color-biscuit-person">
          {{ biscuits.p }}
        </div>
      </div>
    </div>

    <template v-for="card in cards" :key="card.id">
      <CardStacked :card="card" />
    </template>
  </div>
</template>

<script>
import CardStacked from './CardStacked.vue'

export default {
  name: 'ColorStack',

  components: {
    CardStacked,
  },

  inject: ['game', 'openModal'],

  props: {
    player: {
      type: Object,
      required: true
    },
    color: {
      type: String,
      required: true
    },
  },

  computed: {
    cards() {
      return this.zone.cardlist()
    },

    zone() {
      return this.game.zones.byPlayer(this.player, this.color)
    },

    biscuits() {
      return this.zone.biscuits()
    },

    hexes() {
      return this.cards
        .map((card, idx) =>
          card.checkBiscuitIsVisible('h', idx ? this.zone.splay : 'top')
        )
        .filter(Boolean)
    },
  },

  methods: {
    openCardsViewerModal() {
      const cards = this.game.cards.byPlayer(this.player, this.color)
      this.openModal('cardsViewer', { title: this.color, cards })
    },
  },
}
</script>

<style scoped>
.biscuit-counts {
  display: flex;
  flex-direction: row;
  opacity: 0.4;
}

.biscuit-count-square {
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 0.9em;
  margin: 1px 0;
  color: #ddd;
  width: 1.2em;
}

.card-splay {
  flex-grow: 1;
}

.color-stack-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  margin-top: 0.25rem;
  padding: 0 0.25rem;
  border-top: 1px solid #7d6c50;
  border-right: 1px solid #7d6c50;
  border-left: 1px solid #7d6c50;
  max-width: 284px;
}

.hex-count-container {
  display: flex;
  height: 1.2em;
  width: 1.2em;
  margin-top: 1px;
  margin-right: 0.25rem;

  opacity: 0.4;
  background-image: url("~@/assets/img/new/biscuit-hex.png");
  background-size: 1.2em 1.2em;

  align-items: center;
  justify-content: center;
}

.hex-count-text {
  color: #ddd;
  font-size: 0.7em;
}

</style>
