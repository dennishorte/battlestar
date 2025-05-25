<template>
  <i v-if="valid" class="ms ms-cost" :class="manaClasses"/>
  <span v-else>{{ m }}</span>
</template>


<script>
export default {
  name: 'ManaSymbol',

  props: {
    m: {
      type: String,
      default: ''
    },
  },

  computed: {
    manaClasses() {
      if (this.valid) {
        const lower = this.m.toLowerCase()
        return `ms-${lower}`
      }
      else {
        return undefined
      }
    },

    valid() {
      return Boolean(this.m)
    },
  },
}
</script>


<style scoped>
i {
  margin-left: 0!important;  /* This overrides bootstrap margin start classes (eg. ms-1) */
}
</style>
