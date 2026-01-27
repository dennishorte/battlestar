<template>
  <span class="loc-name">{{ name }}</span>
</template>


<script>
export default {
  name: 'LocName',

  props: {
    name: {
      type: String,
      required: true,
    },
  },

  computed: {
    classes() {
      return this.funcs.locClasses ? this.funcs.locClasses(this.loc) : []
    },

    styles() {
      return this.funcs.locStyles ? this.funcs.locStyles(this.loc) : []
    },

    loc() {
      return this.game.zones.byId(this.name)
    },
  },
}
</script>


<style scoped>
</style>
