<template>
  <div class="skill-link">
    <Variant :name="skillName">
      <span class="inner-span" @click="openSkillInfo()">
        {{ skillName }}
      </span>
    </Variant>
  </div>
</template>


<script>
import Variant from './Variant'

export default {
  name: 'SkillLink',

  components: {
    Variant,
  },

  props: {
    skillName: String,
  },

  methods: {
    openSkillInfo() {
      this.$game.ui.modal.skillCards = ''
      this.$bvModal.show('skill-cards-modal')
    },
  },

}
</script>


<style scoped>
.skill-link {
  min-height: 1.7em;
  display: flex;
  align-items: stretch;
}

.inner-span {
  padding: .25em;
  padding-left: .5em;
  display: flex;
  align-items: center;
}
</style>
