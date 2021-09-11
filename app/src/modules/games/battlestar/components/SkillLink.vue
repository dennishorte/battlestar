<template>
  <span :class="classes" @click="openSkillInfo()">
    {{ skillName }}
  </span>
</template>


<script>
export default {
  name: 'SkillLink',

  props: {
    skillName: String,
  },

  computed: {
    classes() {
      return [
        'skill-link',
        this.skillName ? `skill-${this.skillName}` : '',
      ]
    },
  },

  methods: {
    openSkillInfo() {
      this.$store.dispatch('bsg/skillCardInfoRequest', '')
      this.$bvModal.show('skill-cards-modal')
    }
  },
}
</script>


<style scoped>
.skill-link {
  border-radius: .25em;
  padding: .25em;
  color: lightgray;
}
</style>
