<template>
  <b-button
    :class="`skill-${name}`"
    @click="draw"
  >
    {{ name }}
  </b-button>
</template>


<script>
export default {
  name: 'SkillCardDrawButton',

  props: {
    name,
  },

  methods: {
    draw() {
      this.$store.commit('bsg/skillCardDraw', {
        skill: this.name,
        playerId: this.$store.state.auth.user._id
      })
    },
  },
}
</script>
