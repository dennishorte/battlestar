<template>
  <Modal id="card-closeup-modal" @ok="saveChanges">
    <div class="modal-body">
      <Card v-if="selectedCard" :card="selectedCard.data" :size="270" />

      <input class="form-control" v-model="annotation" placeholder="annotation" />
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

  inject: ['do', 'game'],

  data() {
    return {
      annotation: '',
    }
  },

  computed: {
    ...mapState('magic/game', {
      selectedCard: 'selectedCard',
    })
  },

  watch: {
    selectedCard(newValue) {
      if (newValue) {
        this.annotation = newValue.annotation
      }
    },
  },

  methods: {
    saveChanges() {
      this.do(null, {
        name: 'annotate',
        cardId: this.selectedCard.id,
        annotation: this.annotation,
      })
      this.$store.dispatch('magic/game/unselectCard')
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
