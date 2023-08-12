<template>
  <Modal id="cube-card-modal">
    <template #header>Cube Card Viewer</template>

    <Card :card="data" :size="270" />
  </Modal>
</template>


<script>
import Card from '../Card'
import Modal from '@/components/Modal'


export default {
  name: 'CubeCardModal',

  components: {
    Card,
    Modal,
  },

  props: {
    card: Object,
  },

  computed: {
    data() {
      return this.card ? this.card.data : null
    },
  },
}
</script>


<style scoped>
</style>
