<template>
  <div class="card-character" :class="displayClasses">
    <div class="skill-images">
      <div class="image-slice" v-for="(img, index) in skillImages" :key="index">
        <img v-if="!!img" :src="img" />
        <div v-else class="white"></div>
      </div>
    </div>

    <div class="character-name">
      {{ displayName }}
    </div>
  </div>
</template>


<script>
import { bsg } from 'battlestar-common'

const skillImages = {
  politics: require('../assets/images/politics-slice.png'),
  leadership: require('../assets/images/leadership-slice.png'),
  tactics: require('../assets/images/tactics-slice.png'),
  piloting: require('../assets/images/piloting-slice.png'),
  engineering: require('../assets/images/engineering-slice.png'),
  treachery: require('../assets/images/treachery-slice.png'),
}

export default {
  name: 'CardCharacter',

  props: {
    displayClasses: Array,
    displayName: String,
  },

  computed: {
    characterCard() {
      return this.$game.data.filtered.characterCards.filter(c => c.name === this.displayName)
    },

    characterSkills() {
      const skills = {}
      for (const skill of bsg.util.skillList) {
        if (skill === 'treachery')
          continue

        skills[skill] = !!this.characterCard[skill]
      }
      return skills
    },

    skillImages() {
      const images = []
      for (const [skill, value] of Object.entries(this.characterSkills)) {
        if (value) {
          images.push(skillImages[skill])
        }
        else {
          images.push('')
        }
      }
      return images
    },
  },
}
</script>


<style scoped>
img {
  height: 19px;
  width: 8px;
}

.card-character {
  width: 100%;
}

.character-name {
  white-space: nowrap;
}

.image-slice {
  height: 19px;
  width: 8px;
  margin-left: 2px;
  display: inline;
}

.skill-images {
  display: flex;
  flex-direction: row;
  align-items: top;
  float: right;
  margin-top: -3px;
  margin-bottom: -2px;
  margin-right: -2px;
  background: black;
  padding-right: 2px;
}

.white {
  height: 19px;
  width: 8px;
  background-color: white;
}
</style>
