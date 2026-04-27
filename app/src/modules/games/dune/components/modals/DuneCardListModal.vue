<template>
  <ModalBase id="dune-card-list-modal">
    <template #header>{{ title }}</template>

    <div v-if="cards.length === 0" class="modal-empty">none</div>
    <DuneCard v-for="card in cards"
              :key="card.id || card.name"
              :card="card"
              class="modal-card" />
  </ModalBase>
</template>


<script>
import DuneCard from '../DuneCard.vue'
import ModalBase from '@/components/ModalBase.vue'

export default {
  name: 'DuneCardListModal',

  components: { DuneCard, ModalBase },

  inject: ['ui'],

  computed: {
    title() {
      return this.ui.modals.cardList?.title || ''
    },

    cards() {
      return this.ui.modals.cardList?.cards || []
    },
  },
}
</script>


<style scoped>
.modal-card {
  border: 1px solid #d4c8a8;
  font-size: .9em;
  padding: .4em .6em;
  margin-bottom: .35em;
}

.modal-empty {
  color: #8a7a68;
  font-style: italic;
  padding: .5em .25em;
}
</style>
