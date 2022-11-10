<template>
  <Modal id="card-manager-modal">
    <template #header v-if="managedCard">
      {{ name }}
    </template>

    <template v-if="managedCard">
      <div class="wrapper">
        <div class="left-side">
          <div class="card-lock" @click="toggleCardLock">
            <i v-if="cardlock" class="bi-lock-fill"></i>
            <i v-else class="bi-unlock-fill"></i>
          </div>

          <div class="card-counter">
            <div class="btn-group">
              <button @click="removeCard('main')" class="btn btn-outline-primary btn-plus-minus">-</button>
              <button class="btn btn-primary btn-plus-minus-title">main {{ mainCount }}</button>
              <button @click="addCard('main')" class="btn btn-outline-primary btn-plus-minus">+</button>
            </div>
          </div>

          <div class="card-counter">
            <div class="btn-group">
              <button @click="removeCard('side')" type="button" class="btn btn-outline-info btn-plus-minus">-</button>
              <button type="button" class="btn btn-info btn-plus-minus-title">side {{ sideCount }}</button>
              <button @click="addCard('side')" type="button" class="btn btn-outline-info btn-plus-minus">+</button>
            </div>
          </div>

          <div class="card-counter">
            <div class="btn-group">
              <button @click="removeCard('command')" type="button" class="btn btn-outline-success btn-plus-minus">-</button>
              <button type="button" class="btn btn-success btn-plus-minus-title">cmd {{ commandCount }}</button>
              <button @click="addCard('command')" type="button" class="btn btn-outline-success btn-plus-minus">+</button>
            </div>
          </div>
        </div>

        <div class="right-side">
          <Card :card="managedCard" />
        </div>
      </div>
    </template>

  </Modal>
</template>


<script>
import { mapGetters, mapState } from 'vuex'

import cardUtil from '../../util/cardUtil.js'

import Card from '../Card'
import Modal from '@/components/Modal'


export default {
  name: 'CardManagerModal',

  components: {
    Card,
    Modal,
  },

  computed: {
    ...mapState('magic/dm', {
      activeDeck: 'activeDeck',
      cardlock: 'cardlock',
      managedCard: 'managedCard',
    }),

    ...mapGetters('magic/dm', {
      name: 'mcName',
    }),

    mainCount() {
      if (!this.activeDeck) return 0
      return this
        .activeDeck
        .breakdown
        .main
        .filter(c => cardUtil.equals(c, this.managedCard))
        .reduce((acc, datum) => datum.count + acc, 0)
    },

    sideCount() {
      if (!this.activeDeck) return 0
      return this
        .activeDeck
        .breakdown
        .side
        .filter(c => cardUtil.equals(c, this.managedCard))
        .reduce((acc, datum) => datum.count + acc, 0)
    },

    commandCount() {
      if (!this.activeDeck) return 0
      return this
        .activeDeck
        .breakdown
        .command
        .filter(c => cardUtil.equals(c, this.managedCard))
        .reduce((acc, datum) => datum.count + acc, 0)
    },
  },

  methods: {
    addCard(zoneName) {
      this.$store.dispatch('magic/dm/addCurrentCard', zoneName)
    },

    removeCard(zoneName) {
      this.$store.dispatch('magic/dm/removeCurrentCard', zoneName)
    },

    toggleCardLock() {
      this.$store.dispatch('magic/dm/toggleCardLock')
    },
  },

  watch: {
    managedCard(newValue, oldValue) {
      if (newValue) {
        this.$modal('card-manager-modal').show()
      }
      else {
        this.$modal('card-manager-modal').hide()
      }
    },
  },

  mounted() {
    // Whenever the card management modal is closed, clear the state regarding the managed card.
    document
      .getElementById('card-manager-modal')
      .addEventListener('hidden.bs.modal', () => {
        this.$store.dispatch('magic/dm/unmanageCard')
      })
  },
}
</script>


<style scoped>
.card-counter:not(:first-of-type) {
  margin-top: .5em;
}

.card-lock {
  width: 1.8em;
  height: 1.8em;
  border: 1px solid black;
  border-radius: .25em;
  float: right;
  text-align: center;
}

.btn-plus-minus {
  min-width: 3em;
}

.btn-plus-minus-title {
  min-width: 6em;
}

.wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
}
</style>
