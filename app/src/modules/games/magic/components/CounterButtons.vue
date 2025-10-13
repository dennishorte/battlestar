<template>
  <div class="counter-buttons">
    <div>
      {{ name }}
    </div>
    <div class="btn-group">
      <button class="btn btn-sm btn-outline-warning" @click.stop="incrementCounter(-1)">-</button>
      <button class="btn btn-sm btn-secondary">{{ count }}</button>
      <button class="btn btn-sm btn-outline-success" @click.stop="incrementCounter(1)">+</button>
    </div>
  </div>
</template>


<script>
export default {
  name: 'CounterButtons',

  inject: ['do'],

  props: {
    card: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    kind: {
      type: String,
      default: 'counter',
    },
  },

  computed: {
    count() {
      if (this.kind === 'counter') {
        return this.card.counters[this.name]
      }
      else if (this.kind === 'tracker') {
        return this.card.trackers[this.name]
      }
      else {
        return 'error'
      }
    },
  },

  methods: {
    incrementCounter(count) {
      this.do(null, {
        name: `adjust c-${this.kind}`,
        cardId: this.card.id,
        key: this.name,
        count,
      })
    },
  },
}
</script>


<style scoped>
.counter-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}
</style>
