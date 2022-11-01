<template>
  <i v-if="valid" class="ms ms-cost" :class="manaClasses"></i>
  <span v-else>{{ m }}</span>
</template>


<script>
export default {
  name: 'Mana',

  props: {
    m: String,
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
  margin-left: 0!important;  /* This seems to fix a weird margin problem with mana font */
}
</style>
