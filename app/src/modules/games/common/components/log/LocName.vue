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
      return this.funcs.locClasses ? this.funcs.locClasses(this.loc) : []
    },

    styles() {
      return this.funcs.locStyles ? this.funcs.locStyles(this.loc) : []
    },

    loc() {
      return this.game.getZoneById(this.name)
    },
  },
}
</script>


<style scoped>
</style>
