<template>
  <ModalBase id="card-draft-modal">
    <div v-if="!!card" class="modal-body">
      <div class="card-holder">
        <MagicCard :card="card" :size="270" />
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
  </ModalBase>
</template>


<script>
import MagicCard from '@/modules/magic/components/card/MagicCard.vue'
import ModalBase from '@/components/ModalBase.vue'


export default {
  name: 'CardDraftModal',

  components: {
    MagicCard,
    ModalBase,
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
        const player = this.game.players.byName(this.actor.name)
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
