<template>
  <div class="main-next-player">
    <b-button
      block
      :disabled="!commonCrisis"
      :variant="!!commonCrisis ? 'info' : ''"
      @click="cleanCrisis"
    >Clean Up Crisis Card</b-button>
  </div>
</template>


<script>
export default {
  name: 'MainCleanup',

  computed: {
    commonCrisis() {
      return this.$store.getters['bsg/commonCrisis']
    },
  },

  methods: {
    cleanCrisis() {
      this.$store.commit('bsg/crisisCleanup')
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
