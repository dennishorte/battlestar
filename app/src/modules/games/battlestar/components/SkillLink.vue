<template>
  <span class="wrapper">
    <span :style="variantBackground(skillName)"></span>
    <span
      :style="variantForeground(skillName)"
      @click="openSkillInfo()"
    >
      {{ skillName }}
    </span>
  </span>
</template>


<script>
import variants from '../lib/variants.js'

export default {
  name: 'SkillLink',

  props: {
    skillName: String,
  },

  methods: {
    openSkillInfo() {
      this.$store.dispatch('bsg/skillCardInfoRequest', '')
      this.$bvModal.show('skill-cards-modal')
    },


    variantBackground(name) {
      const backgroundImage = variants.fetch(name).bgImage
      const overlayColor = variants.fetch(name).bgColor

      if (backgroundImage || overlayColor) {
        const style ={
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
        }

        if (backgroundImage) {
          style.backgroundImage = `url(${backgroundImage})`
        }
        if (overlayColor) {
          style.boxShadow = `inset 0 0 0 500px ${overlayColor}`
        }

        return style
      }
      else {
        return {}
      }
    },

    variantForeground(name) {
      if (variants.fetch(name)) {
        return {
          color: variants.fetch(name).fgColor,
          position: 'relative',
        }
      }
      else {
        return {}
      }
    },

  },
}
</script>


<style scoped>
.wrapper {
  position: relative;
  font-size: .85em;
  padding: .5em;
  margin-right: .25em;
}

.wrapper > span {
  border-radius: .5em;
}
</style>
