<template>
  <Modal id="card-manager-modal">
    <template #header>{{ card.name }}</template>

    <div class="card-lock" @click="toggleCardLock">
      <i v-if="cardLock" class="bi-lock-fill"></i>
      <i v-else class="bi-unlock-fill"></i>
    </div>

    <div class="card-counter">
      <div class="btn-group">
        <button type="button" class="btn btn-outline-primary btn-plus-minus">-</button>
        <button type="button" class="btn btn-primary btn-plus-minus-title">main 2</button>
        <button type="button" class="btn btn-outline-primary btn-plus-minus">+</button>
      </div>
    </div>

    <div class="card-counter">
      <div class="btn-group">
        <button type="button" class="btn btn-outline-info btn-plus-minus">-</button>
        <button type="button" class="btn btn-info btn-plus-minus-title">side 1</button>
        <button type="button" class="btn btn-outline-info btn-plus-minus">+</button>
      </div>
    </div>

    <div class="card-counter">
      <div class="btn-group">
        <button type="button" class="btn btn-outline-success btn-plus-minus">-</button>
        <button type="button" class="btn btn-success btn-plus-minus-title">cmd 1</button>
        <button type="button" class="btn btn-outline-success btn-plus-minus">+</button>
      </div>
    </div>

  </Modal>
</template>


<script>
import Modal from '@/components/Modal'


export default {
  name: 'CardManagerModal',

  components: {
    Modal,
  },

  inject: ['bus'],

  props: {
    card: Object,
    cardLock: Boolean,
  },

  methods: {
    toggleCardLock() {
      this.bus.emit('toggle-card-lock')
    },
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
</style>
