<template>
  <Modal id="card-closeup-modal">
    <Card v-if="selectedCard" :card="selectedCard.data" :size="270" />
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
