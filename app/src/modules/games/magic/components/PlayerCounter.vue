<template>
  <div class="counter" @click="closeup">
    <div class="counter-text">
      {{ name }}: {{ count }}
    </div>

    <div class="counter-buttons" :class="buttonClasses">
      <i class="bi bi-dice-5-fill counter-red" @click.stop="increment(-5)"></i>
      <i class="bi bi-dice-1-fill counter-red" @click.stop="increment( -1)"></i>
      <i class="bi bi-dice-1-fill counter-green" @click.stop="increment(1)"></i>
      <i class="bi bi-dice-5-fill counter-green" @click.stop="increment(5)"></i>
    </div>
  </div>
</template>


<script>
export default {
  name: 'PlayerCounter',

  inject: ['do'],

  props: {
    player: Object,
    name: String,
    buttonSize: {
      type: String,
      default: 'normal',
    },
  },

  computed: {
    buttonClasses() {
      return this.buttonSize === 'large' ? 'counter-buttons-large' : 'counter-buttons-normal'
    },

    count() {
      return this.player.getCounter(this.name)
    },
  },

  methods: {
    closeup() {
      this.$modal('counter-closeup-modal').show()
    },

    increment(count) {
      this.do(null, {
        name: 'adjust counter',
        playerName: this.player.name,
        counter: this.name,
        amount: count,
      })
    },
  },
}

</script>


<style scoped>
.counter {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.counter-buttons-normal {
  font-size: .9em;
}

.counter-buttons-large {
  font-size: 1.5em;
}

.bi:not(:first-of-type) {
  margin-left: 2px;
}

.counter-green {
  color: green;
}

.counter-red {
  color: red;
}
</style>
