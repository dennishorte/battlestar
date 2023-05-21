<template>
  <Modal id="card-closeup-modal">
    <div v-if="!!cardData" class="modal-body">
      <div class="card-holder">
        <Card :card="cardData" :size="270" />
      </div>
    </div>
  </Modal>
</template>


<script>
import { util } from 'battlestar-common'

import Card from '@/modules/magic/components/Card'
import Modal from '@/components/Modal'


export default {
  name: 'CardCloseupModal',

  components: {
    Card,
    Modal,
  },

  props: {
    cardData: {
      type: Object,
      default: null,
    },
  },

  inject: ['do', 'game'],

  data() {
    return {
    }
  },

  computed: {
  },

  watch: {
  },

  methods: {
  },
}
</script>


<style scoped>
.card-holder {
  width: 100%;
  overflow-x: scroll;
}

.modal-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
