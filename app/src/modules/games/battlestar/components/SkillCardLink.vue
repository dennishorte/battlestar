<template>
  <span :class="classes" @click="openSkillInfo()">
    {{ card.value }}: {{ card.name }}
  </span>
</template>


<script>
import bsgutil from '../util.js'

export default {
  name: 'SkillCardLink',

  props: {
    card: Object,
  },

  computed: {
    classes() {
      return [
        'skill-card-link',
        `skill-${bsgutil.skillType(this.card)}`,
      ]
    },
  },

  methods: {
    openSkillInfo() {
      this.$store.commit('bsg/skillCardInfoRequest', this.card.name)
      this.$bvModal.show('skill-cards-modal')
    }
  },
}
</script>


<style scoped>
.skill-card-link {
  border-radius: .25em;
  padding: .25em;
}
</style>
