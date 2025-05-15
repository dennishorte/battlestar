<template>
  <ModalBase id="card-closeup-modal" @ok="saveChanges">
    <template #header>
      <div class="header-button" @click="debug">debug</div>
    </template>

    <div v-if="selectedCard" class="modal-body">
      <div class="card-holder">
        <MagicCard v-if="cardIsVisible" :card="selectedCard" :size="270" />
      </div>

      <div v-if="cardIsVisible" class="labeled-input-wrapper mt-2">
        <label class="col-form-label">Active Face</label>
        <div>
          <select class="form-select" v-model.number="activeFaceIndex">
            <option v-for="(_, index) in selectedCard.numFaces()" :key="index" :value="index">
              {{ selectedCard.name(index) }}
            </option>
          </select>
        </div>
      </div>

      <input class="form-control mt-2" v-model="annotation" placeholder="annotation" />
      <input class="form-control mt-2" v-model="annotationEOT" placeholder="end of turn" />

      <div class="counters">
        <h5>Counters</h5>
        <div class="row">
          <div class="col-6">
            <div class="counter" v-for="[key, ] in counters" :key="key">
              <CounterButtons :card="selectedCard" :name="key" />
            </div>
          </div>
          <div class="col-6">
            <div class="d-flex flex-row">
              <input class="form-control" v-model="newCounter" placeholder="new counter name" />
              <button class="btn btn-sm btn-success" @click="addCounter">
                <i class="bi bi-plus-lg"/>
              </button>
            </div>
          </div>
        </div>

      </div>

      <div class="trackers">
        <h5>Trackers</h5>
        <div class="row">
          <div class="col-6">
            <div class="tracker" v-for="[key, ] in trackers" :key="key">
              <CounterButtons :card="selectedCard" :name="key" kind="tracker" />
            </div>
          </div>
          <div class="col-6">
            <div class="d-flex flex-row">
              <input class="form-control" v-model="newTracker" placeholder="new tracker name" />
              <button class="btn btn-sm btn-success" @click="addTracker">
                <i class="bi bi-plus-lg"/>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  </ModalBase>
</template>


<script>
import { mapState } from 'vuex'

import MagicCard from '@/modules/magic/components/MagicCard'
import CounterButtons from './CounterButtons'
import ModalBase from '@/components/ModalBase'


export default {
  name: 'CardCloseupModal',

  components: {
    MagicCard,
    CounterButtons,
    ModalBase,
  },

  inject: ['actor', 'do', 'game'],

  data() {
    return {
      activeFaceIndex: 0,
      annotation: '',
      annotationEOT: '',
      newCounter: '',
      newTracker: '',
    }
  },

  computed: {
    ...mapState('magic/game', {
      selectedCardId: 'selectedCardId',
    }),

    cardIsVisible() {
      const player = this.game.getPlayerByName(this.actor.name)
      return this.game.checkCardIsVisible(player, this.selectedCard)
    },

    counters() {
      return Object.entries(this.selectedCard.g.counters)
    },

    selectedCard() {
      return this.game.getCardById(this.selectedCardId)
    },

    trackers() {
      return Object.entries(this.selectedCard.g.trackers)
    },
  },

  watch: {
    selectedCard(newValue) {
      if (newValue) {
        this.activeFaceIndex = newValue.g.activeFaceIndex
        this.annotation = newValue.g.annotation
        this.annotationEOT = newValue.g.annotationEOT
      }
    },
  },

  methods: {
    addCounter() {
      if (this.newCounter) {
        this.do(null, {
          name: 'add counter',
          cardId: this.selectedCard.g.id,
          key: this.newCounter,
        })
      }
    },

    addTracker() {
      if (this.newTracker) {
        this.do(null, {
          name: 'add tracker',
          cardId: this.selectedCard.g.id,
          key: this.newTracker,
        })
      }
    },

    debug() {
      const copy = this.selectedCard.toJSON()
      copy.g = { ...this.selectedCard.g }
      copy.g.owner = this.selectedCard.g.owner.name
      copy.visibility = this.selectedCard.visibility.map(player => player.name)
      copy.zone = this.selectedCard.zone
      copy.home = this.selectedCard.home

      console.log(copy)
    },

    saveChanges() {
      if (this.selectedCard.g.activeFaceIndex !== this.activeFaceIndex) {
        this.do(null, {
          name: 'active face',
          cardId: this.selectedCard.g.id,
          faceIndex: this.activeFaceIndex,
        })
      }
      if (this.selectedCard.g.annotation !== this.annotation) {
        this.do(null, {
          name: 'annotate',
          cardId: this.selectedCard.g.id,
          annotation: this.annotation,
        })
      }
      if (this.selectedCard.g.annotationEOT !== this.annotationEOT) {
        this.do(null, {
          name: 'annotate eot',
          cardId: this.selectedCard.g.id,
          annotation: this.annotationEOT,
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

.counters,
.trackers {
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
