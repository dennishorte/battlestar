<template>
  <ModalBase id="cards-viewer-modal" scrollable>
    <template #header>{{ title }}</template>

    <div v-if="splayBreakdown" class="splay-breakdown">
      <div
        v-for="row in splayBreakdown"
        :key="row.splay"
        class="splay-row"
        :class="{ 'splay-row-current': row.isCurrent }"
      >
        <div class="splay-label">{{ row.splay }}</div>
        <div class="splay-biscuits">
          <div class="splay-biscuit color-biscuit-castle">{{ row.biscuits.k }}</div>
          <div class="splay-biscuit color-biscuit-coin">{{ row.biscuits.c }}</div>
          <div class="splay-biscuit color-biscuit-lightbulb">{{ row.biscuits.s }}</div>
          <div class="splay-biscuit color-biscuit-leaf">{{ row.biscuits.l }}</div>
          <div class="splay-biscuit color-biscuit-factory">{{ row.biscuits.f }}</div>
          <div class="splay-biscuit color-biscuit-clock">{{ row.biscuits.i }}</div>
          <div class="splay-biscuit color-biscuit-person">{{ row.biscuits.p }}</div>
        </div>
      </div>
    </div>

    <div class="card-viewer-list">
      <CardFull
        v-for="card in filteredCards"
        :key="card.id"
        :card="card"
        class="viewer-card"
      />
    </div>
  </ModalBase>
</template>


<script>
import CardFull from './CardFull.vue'
import ModalBase from '@/components/ModalBase.vue'

export default {
  name: 'CardsViewerModal',

  components: {
    CardFull,
    ModalBase,
  },

  props: {
    title: {
      type: String,
      default: '',
    },
    cards: {
      type: Array,
      default: () => [],
    },
    zone: {
      type: Object,
      default: null,
    },
  },

  computed: {
    filteredCards() {
      return this.cards.filter(card => !card.isMuseum)
    },

    splayBreakdown() {
      if (!this.zone) {
        return null
      }
      const splays = ['none', 'left', 'right', 'up', 'aslant']
      return splays.map(splay => ({
        splay,
        biscuits: this.zone.biscuits(splay),
        isCurrent: this.zone.splay === splay,
      }))
    },
  },
}
</script>


<style scoped>
.card-viewer-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.viewer-card {
  margin-right: 1px;
  width: 250px;
}

.splay-breakdown {
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.splay-row {
  display: flex;
  align-items: center;
  padding: 1px 0;
}

.splay-row-current {
  font-weight: bold;
}

.splay-label {
  width: 4em;
  text-align: right;
  margin-right: 0.5em;
}

.splay-biscuits {
  display: flex;
}

.splay-biscuit {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.6em;
  height: 1.4em;
  color: #ddd;
  font-size: 0.9em;
}
</style>
