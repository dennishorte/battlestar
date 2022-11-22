<template>
  <Modal id="cube-card-modal">
    <template #header>Cube Card Viewer</template>

    <CardEditor :card="data" v-if="editable" />
    <Card :card="data" :size="270" v-else />
  </Modal>
</template>


<script>
import Card from '../Card'
import CardEditor from '../CardEditor'
import Modal from '@/components/Modal'


export default {
  name: 'CubeCardModal',

  components: {
    Card,
    CardEditor,
    Modal,
  },

  props: {
    card: Object,

    editable: {
      type: Boolean,
      default: false,
    },
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
