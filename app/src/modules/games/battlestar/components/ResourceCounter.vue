<template>
  <div class="resource-counter">
    <div style="float: right; margin-left: 2px;" @click="decrement">
      <font-awesome-icon :icon="['far', 'minus-square']" />
    </div>
    <div style="float: right;" @click="increment">
      <font-awesome-icon :icon="['far', 'plus-square']" />
    </div>
    <div>
      {{ name }}: {{ value }}
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
  name: 'Location',

  props: {
    name: String,
    notes: String,
    value: Number,
  },

  methods: {
    increment() {
      this.resourceChanged(1)
    },

    decrement() {
      this.resourceChanged(-1)
    },

    resourceChanged(amt) {
      this.$emit('resource-changed', {
        name: this.name,
        amount: amt,
      })
    },
  },
}
</script>

<style>
.notes {
    font-size: .6em;
    color: #777;
}
</style>
