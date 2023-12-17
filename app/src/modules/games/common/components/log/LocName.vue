<template>
  <div class="loc-name">
    {{ name }}
  </div>
</template>


<script>
export default {
  name: 'LocName',

  props: {
    name: String,
  },

  computed: {
    classes() {
      if (this.funcs.locClasses) {
        return this.funcs.locClasses(this.loc)
      }
    },

    styles() {
      if (this.funcs.locStyles) {
        return this.funcs.locStyles(this.loc)
      }
    },

    loc() {
      return this.game.getZoneById(this.name)
    },
  },
}
</script>


<style scoped>
</style>
