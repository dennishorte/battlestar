<template>
  <ModalBase id="cards-viewer-modal" scrollable>
    <template #header>{{ title }}</template>
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
  },

  computed: {
    filteredCards() {
      return this.cards.filter(card => !card.isMuseum)
    },
  },
}
</script>


<style scoped>
.cards-viewer-modal {

}

.card-viewer-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.viewer-card {
  margin-right: 1px;
  width: 250px;
}
</style>
