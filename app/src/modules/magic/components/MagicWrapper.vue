<template>
  <div class="magic-wrapper">
    <slot></slot>
  </div>
</template>


<script>
export default {
  name: 'MagicWrapper',

  created() {
    this.$store.dispatch('magic/cards/ensureLoaded')
  },
}
</script>


<style scoped>
</style>
