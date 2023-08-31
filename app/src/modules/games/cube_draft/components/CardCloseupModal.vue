<template>
  <Modal id="card-closeup-modal">
    <div v-if="!!card" class="modal-body">
      <div class="card-holder">
        <Card :card="card.data" :size="270" />
      </div>
    </div>

    <template #footer>
      <button
        class="btn btn-danger"
        @click="removeCard"
        data-bs-dismiss
      >
        remove
      </button>

      <button
        class="btn btn-secondary"
        :class="commandClass"
        @click="setZone('command')"
        data-bs-dismiss="modal"
      >
        command
      </button>

      <button
        class="btn btn-secondary"
        :class="sideClass"
        @click="setZone('side')"
        data-bs-dismiss="modal"
      >sideboard</button>

      <button
        class="btn"
        :class="mainClass"
        @click="setZone('main')"
        data-bs-dismiss="modal"
      >main</button>

      <button class="btn btn-primary" @click="ok" data-bs-dismiss="modal">ok</button>
    </template>

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
    card: {
      type: Object,
      default: null,
    },
  },

  inject: ['game'],

  data() {
    return {
    }
  },

  computed: {
    commandClass() {
      if (this.card) {
        return this.card.zone === 'command' ? 'btn-success' : 'btn-secondary'
      }
    },
    mainClass() {
      if (this.card) {
        return this.card.zone === 'main' ? 'btn-success' : 'btn-secondary'
      }
    },
    sideClass() {
      if (this.card) {
        return this.card.zone === 'side' ? 'btn-success' : 'btn-secondary'
      }
    },

    removeCard() {
      this.$store.commit('magic/dm/removeCard', this.card)
    },
  },

  methods: {
    setZone(name) {
      this.$store.commit('magic/dm/setCardZone', {
        card: this.card,
        zoneName: name
      })
    },
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
