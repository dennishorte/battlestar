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
  name: 'PhaseButton',

  inject: ['do', 'game'],

  props: {
    name: {
      type: String,
      required: true
    },
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
      this.do(null, {
        name: 'select phase',
        phase: this.name,
      })
      this.$store.dispatch('magic/game/unselectCard')
    },
  },
}
</script>


<style scoped>
.highlighted {
  color: black;
  font-weight: bold;
}

.phase-button {
  font-size: 1.1em;
}
</style>
