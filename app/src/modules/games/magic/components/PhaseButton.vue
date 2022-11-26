<template>
  <div
    class="phase-button"
    :class="extraClasses"
    @click="selectPhase"
  >
    {{ name }}
  </div>
</template>


<script>
export default {
  name: 'Phase Button',

  inject: ['do', 'game'],

  props: {
    name: String,
  },

  computed: {
    extraClasses() {
      if (this.game.getPhase() === this.name) {
        return 'highlighted'
      }
      else {
        return ''
      }
    }
  },

  methods: {
    selectPhase() {
      this.do({
        name: 'select phase',
        phase: this.name,
      })
    },
  },
}
</script>


<style scoped>
.highlighted {
  font-weight: bold;
}

.phase-button {
  font-size: 1.1em;
}
</style>
