<template>
  <div class="card-character expanded-card-inner" :class="displayClasses">
    <div class="character-name">
      {{ displayName }}
    </div>

    <div class="skill-images">
      <div class="image-slice" v-for="(img, index) in skillImages" :key="index">
        <img v-if="!!img" :src="img" />
        <div v-else class="white"></div>
      </div>
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
    card: Object,
  },

  computed: {
    characterSkills() {
      const skills = {}
      for (const skill of bsg.util.skillList) {
        if (skill === 'treachery')
          continue

        skills[skill] = !!this.card[skill]
      }
      return skills
    },

    displayClasses() {
      return this.isVisible ? [] : ['hidden']
    },

    displayName() {
      return this.isVisible ? this.card.name : this.card.kind
    },

    isVisible() {
      return this.$game.checkCardIsVisible(this.card)
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
  margin-top: -2px;
  margin-bottom: -3px;
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
