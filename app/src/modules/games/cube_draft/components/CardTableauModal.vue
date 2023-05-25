<template>
  <Modal class="modal-xl">
    <div class="modal-body">

      <CardTableau :cards="cards" />

    </div>
  </Modal>
</template>


<script>
import { util } from 'battlestar-common'

import CardTableau from './CardTableau'
import Modal from '@/components/Modal'


export default {
  name: 'CardTableauModal',

  components: {
    CardTableau,
    Modal,
  },

  props: {
    cards: {
      type: Array,
      default: [],
    },
  },
}
</script>


<style scoped>
.modal-body {
  width: 100%;
}
</style>
