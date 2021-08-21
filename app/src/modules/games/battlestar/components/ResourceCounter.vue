<template>
  <div class="resource-counter">
    <div style="float: right; margin-left: 2px;" @click="decrement">
      <font-awesome-icon :icon="['far', 'minus-square']" />
    </div>
    <div style="float: right;" @click="increment">
      <font-awesome-icon :icon="['far', 'plus-square']" />
    </div>
    <slot></slot>:
    {{ value }}
  </div>
</template>


<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlusSquare, faMinusSquare } from '@fortawesome/free-regular-svg-icons'
library.add(faPlusSquare, faMinusSquare)

export default {
  name: 'Location',

  props: {
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
        name: this.$slots.default[0].text,
        amount: amt,
      })
    },
  },
}
</script>
