<template>
  <div class="jump-remove-ships">
    <b-button variant="primary" block @click="removeShips">Remove All Ships</b-button>
  </div>
</template>


<script>
export default {
  name: 'JumpRemoveShips',

  methods: {
    removeShips() {
      this.$store.commit('bsg/clearSpace')
    },
  },
}
</script>


<style scoped>
.description {
  color: #444;
  font-size: .7em;
}
</style>
