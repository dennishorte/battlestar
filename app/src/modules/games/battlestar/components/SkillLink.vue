<template>
<span :class="classes" @click="openSkillInfo()">
  {{ cardName || skillName }}
</span>
</template>


<script>
export default {
  name: 'SkillLink',

  props: {
    cardName: String,
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
      this.$store.commit('bsg/skillCardInfoRequest', this.cardName || '')
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

.skill-politics {
    color: darkgray;
    background-color: yellow;
}

.skill-leadership {
    background-color: green;
}

.skill-tactics {
    background-color: purple;
}

.skill-piloting {
    background-color: red;
}

.skill-engineering {
    background-color: blue;
}

.skill-treachery {
    color: darkgray;
    background-color: beige;
}
</style>
