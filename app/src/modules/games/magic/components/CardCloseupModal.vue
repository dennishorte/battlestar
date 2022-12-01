<template>
  <Modal id="card-closeup-modal">
    <div class="modal-body">
      <Card v-if="selectedCard" :card="selectedCard.data" :size="270" />
    </div>
  </Modal>
</template>


<script>
import { mapState } from 'vuex'

import Card from '@/modules/magic/components/Card'
import Modal from '@/components/Modal'


export default {
  name: 'CardCloseupModal',

  components: {
    Card,
    Modal,
  },

  computed: {
    ...mapState('magic/game', {
      selectedCard: 'selectedCard',
    })
  },

  watch: {
    selectedCard(newValue, oldValue) {
      console.log('selected card', newValue, oldValue)
    },
  },
}
</script>


<style scoped>
.modal-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
