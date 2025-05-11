<template>
  <Modal id="card-draft-modal">
    <div v-if="!!card" class="modal-body">
      <div class="card-holder">
        <Card :card="card" :size="270" />
      </div>
    </div>

    <template #footer>
      <button class="btn btn-secondary" data-bs-dismiss="modal">cancel</button>
      <button
        class="btn btn-danger"
        @click="draftCard"
        data-bs-dismiss="modal"
        :disabled="cannotDraft"
      >draft</button>
    </template>
  </Modal>
</template>


<script>
import Card from '@/modules/magic/components/Card'
import Modal from '@/components/Modal'


export default {
  name: 'CardDraftModal',

  components: {
    Card,
    Modal,
  },

  emits: ['draft-card'],

  props: {
    card: {
      type: Object,
      default: null,
    },
  },

  inject: ['actor', 'game'],

  computed: {
    cannotDraft() {
      if (this.card) {
        const player = this.game.getPlayerByName(this.actor.name)
        return this.card.g.id === player.scarredCardId
      }
      else {
        return true
      }
    },
  },

  methods: {
    draftCard() {
      this.$emit('draft-card', this.card)
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
