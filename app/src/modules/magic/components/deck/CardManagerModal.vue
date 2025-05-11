<template>
  <Modal id="card-manager-modal">
    <template #header v-if="card">
      {{ card.name() }}
    </template>

    <div v-if="card" class="container">
      <Card :card="card" />
      <div class="zone-buttons">
        <div>modify:</div>
        <button :class="mainButtonClasses" @click="setZone('main')">maindeck ({{ count('main') }})</button>
        <button :class="sideButtonClasses" @click="setZone('side')">sideboard ({{ count('side') }})</button>
        <button :class="commandButtonClasses" @click="setZone('command')">command ({{ count('command') }})</button>
      </div>

      <div>
        <button class="btn btn-success" @click="addCard">add</button>
        <button class="btn btn-warning" @click="removeCard">remove</button>
      </div>

      <div>
        <div>move to:</div>
        <button class="btn btn-secondary" :disabled="zone === 'main'" @click="moveTo('main')">maindeck</button>
        <button class="btn btn-secondary" :disabled="zone === 'side'" @click="moveTo('side')">sideboard</button>
        <button class="btn btn-secondary" :disabled="zone === 'command'" @click="moveTo('command')">command</button>
      </div>

    </div>
  </Modal>
</template>


<script>
import Card from '../Card'
import Modal from '@/components/Modal'

export default {
  name: 'CardManagerModal',

  components: {
    Card,
    Modal,
  },

  inject: ['bus'],

  props: {
    deck: Object,
  },

  data() {
    return {
      card: null,
      zone: null,
    }
  },

  computed: {
    mainButtonClasses() {
      return this.zone === 'main' ? ['btn', 'btn-primary'] : ['btn', 'btn-outline-primary']
    },

    sideButtonClasses() {
      return this.zone === 'side' ? ['btn', 'btn-primary'] : ['btn', 'btn-outline-primary']
    },

    commandButtonClasses() {
      return this.zone === 'command' ? ['btn', 'btn-primary'] : ['btn', 'btn-outline-primary']
    },
  },

  methods: {
    addCard() {
      this.deck.addCard(this.card, this.zone)
    },

    beginManagement({ card, zone }) {
      this.card = card
      this.zone = zone
      this.$modal('card-manager-modal').show()
    },

    count(zone) {
      return this.deck.cardIdsByZone[zone].filter(x => x === this.card._id).length
    },

    moveTo(zone) {
      if (this.deck.cardIdsByZone[this.zone].includes(this.card._id)) {
        this.deck.addCard(this.card, zone)
        this.deck.removeCard(this.card, this.zone)
      }
    },

    removeCard() {
      this.deck.removeCard(this.card, this.zone)
    },

    setZone(zone) {
      this.zone = zone
    },
  },

  mounted() {
    this.bus.on('card-manager:begin', this.beginManagement)
  },
}
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .25em;
}

button:not(:first-of-type) {
  margin-left: .25em;
}

.zone-buttons {
  margin-top: .25em;
}
</style>
