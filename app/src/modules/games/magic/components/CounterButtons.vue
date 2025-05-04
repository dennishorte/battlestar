<template>
  <div class="counter-buttons">
    <div>
      {{ name }}
    </div>
    <div class="btn-group">
      <button class="btn btn-sm btn-outline-warning" @click.stop="incrementCounter(-1)">-</button>
      <button class="btn btn-sm btn-secondary">{{ card.g.counters[name] }}</button>
      <button class="btn btn-sm btn-outline-success" @click.stop="incrementCounter(1)">+</button>
    </div>
  </div>
</template>


<script>
export default {
  name: 'CounterButtons',

  inject: ['do'],

  props: {
    card: Object,
    name: String,
  },

  methods: {
    incrementCounter(count) {
      this.do(null, {
        name: 'adjust c-counter',
        cardId: this.card.g.id,
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
