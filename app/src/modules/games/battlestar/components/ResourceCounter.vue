<template>
  <div class="resource-counter">
    <div style="float: left; margin-right: 2px;" @click="decrement">
      <font-awesome-icon :icon="['far', 'minus-square']" />
    </div>
    <div style="float: right;" @click="increment">
      <font-awesome-icon :icon="['far', 'plus-square']" />
    </div>
    <div>
      <div class="name-value-wrapper">
        <div>{{ title }}:</div>
        <div>{{ value }}</div>
      </div>
      <div v-if="!!notes" class="notes">
        {{ notes }}
      </div>
    </div>
  </div>
</template>


<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlusSquare, faMinusSquare } from '@fortawesome/free-regular-svg-icons'
library.add(faPlusSquare, faMinusSquare)

export default {
  name: 'ResourceCounter',

  props: {
    name: String,
    notes: String,
    title: String,
  },

  computed: {
    value() {
      return this.$game.getCounterByName(this.name)
    },
  },

  methods: {
    increment() {
      this.resourceChanged(1)
    },

    decrement() {
      this.resourceChanged(-1)
    },

    resourceChanged(amt) {
      console.log('counter changed', this.name, amt)
    },
  },
}
</script>

<style scoped>
.name-value-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-right: .25em;
}

.notes {
    font-size: .6em;
    color: #777;
}

.resource-counter {
    font-size: .8em;
}
</style>
