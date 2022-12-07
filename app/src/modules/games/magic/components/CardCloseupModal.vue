<template>
  <Modal id="card-closeup-modal" @ok="saveChanges">
    <template #header>
      <div class="header-button" @click="debug">debug</div>
    </template>

    <div v-if="selectedCard" class="modal-body">
      <div class="card-holder">
        <Card :card="selectedCard.data" :size="270" />
      </div>

      <div class="labeled-input-wrapper mt-2">
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

      <div class="counters">
        <h5>Counters</h5>
        <div class="row">
          <div class="col-6">
            <div class="counter" v-for="[key, value] in counters">
              <CounterButtons :card="selectedCard" :name="key" />
            </div>
          </div>
          <div class="col-6">
            <div class="d-flex flex-row">
              <input class="form-control" v-model="newCounter" placeholder="new counter name" />
              <button class="btn btn-sm btn-success" @click="addCounter">
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </Modal>
</template>


<script>
import { mapState } from 'vuex'
import { util } from 'battlestar-common'

import Card from '@/modules/magic/components/Card'
import CounterButtons from './CounterButtons'
import Modal from '@/components/Modal'


export default {
  name: 'CardCloseupModal',

  components: {
    Card,
    CounterButtons,
    Modal,
  },

  inject: ['do', 'game'],

  data() {
    return {
      activeFace: '',
      annotation: '',
      newCounter: '',
    }
  },

  computed: {
    ...mapState('magic/game', {
      selectedCardId: 'selectedCardId',
    }),

    counters() {
      return Object.entries(this.selectedCard.counters)
    },

    selectedCard() {
      return this.game.getCardById(this.selectedCardId)
    },
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
    addCounter() {
      if (this.newCounter) {
        this.do(null, {
          name: 'add counter',
          cardId: this.selectedCard.id,
          key: this.newCounter,
        })
      }
    },

    debug() {
      const copy = { ...this.selectedCard }
      copy.owner = copy.owner.name
      copy.data = util.deepcopy(copy.data)
      copy.visibility = copy.visibility.map(player => player.name)

      console.log(copy)
    },

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
h5 {
  margin-top: .5em;
  margin-bottom: 0;
}

.card-holder {
  width: 100%;
  overflow-x: scroll;
}

.counters {
  width: 100%;
}

.header-button {
  font-size: 1rem;
  font-weight: normal;
}

.header-stuff {
  width: 100%;
  margin-left: auto;
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
