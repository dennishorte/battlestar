<template>
  <Modal id="card-closeup-modal" @ok="saveChanges">
    <div v-if="selectedCard" class="modal-body">
      <div class="card-holder">
        <Card :card="selectedCard.data" :size="270" />
      </div>

      <div class="labeled-input-wrapper">
        <label class="col-form-label">Active Face</label>
        <div>
          <select class="form-select" v-model.number="activeFace">
            <option v-for="face in selectedCard.data.card_faces">
              {{ face.name }}
            </option>
          </select>
        </div>
      </div>

      <input class="form-control mt-2" v-model="annotation" placeholder="annotation" />
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
      activeFace: '',
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
        this.activeFace = newValue.activeFace
        this.annotation = newValue.annotation
      }
    },
  },

  methods: {
    saveChanges() {
      if (this.selectedCard.activeFace !== this.activeFace) {
        this.do(null, {
          name: 'active face',
          cardId: this.selectedCard.id,
          face: this.activeFace,
        })
      }
      if (this.selectedCard.annotation !== this.annotation) {
        this.do(null, {
          name: 'annotate',
          cardId: this.selectedCard.id,
          annotation: this.annotation,
        })
      }
      this.$store.dispatch('magic/game/unselectCard')
    },
  },
}
</script>


<style scoped>
.card-holder {
  width: 100%;
  overflow-x: scroll;
}

.labeled-input-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.labeled-input-wrapper > label {
  width: 25%;
}

.labeled-input-wrapper > div {
  width: 75%;
}

.modal-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
