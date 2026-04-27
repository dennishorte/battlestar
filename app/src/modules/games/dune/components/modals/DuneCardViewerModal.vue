<template>
  <ModalBase id="dune-card-viewer-modal">
    <template #header>Card</template>

    <DuneCard v-if="card" :card="card" class="modal-card" />
    <div v-else class="modal-empty">No card selected</div>
  </ModalBase>
</template>


<script>
import DuneCard from '../DuneCard.vue'
import ModalBase from '@/components/ModalBase.vue'

export default {
  name: 'DuneCardViewerModal',

  components: { DuneCard, ModalBase },

  inject: ['ui'],

  computed: {
    card() {
      return this.ui.modals.cardViewer || null
    },
  },
}
</script>


<style scoped>
.modal-card {
  border: none;
  font-size: 1em;
  padding: .6em .8em;
}

.modal-empty {
  color: #8a7a68;
  font-style: italic;
  padding: .5em .25em;
}
</style>
