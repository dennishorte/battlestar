<template>
  <div class="card-container card-container-200px" :class="containerClasses">
    <div class="card-border">
      <div class="card-background">
        <div class="card-frame">

          <div class="frame-header frame-foreground">
            <div class="frame-card-name">{{ face.name }}</div>

            <div class="frame-mana-cost">
              <ManaCost :cost="manaCost" />
            </div>
          </div>

          <img
            class="frame-art"
            alt="card art"
            :src="imageUrl" />

          <div class="frame-type-line frame-foreground">
            <div class="frame-card-type">{{ face.type_line }}</div>
            <div class="frame-card-icon" :class="rarity">{{ setIcon }}</div>
          </div>

          <div class="frame-text-box">
            <OracleText :text="oracleText" />

            <div class="frame-flavor-wrapper">
              <p v-if="flavorText" class="frame-flavor-text">{{ flavorText }}</p>
            </div>

            <div class="frame-achievements-wrapper">
              <p v-for="ach of achievements" class="frame-achievement-desc">
                {{ ach.text }}
              </p>
            </div>
          </div>

          <div class="frame-pt-loyalty frame-foreground" v-if="powerToughness">
            {{ powerToughness }}
          </div>

        </div> <!-- frame -->
      </div> <!-- background -->
    </div> <!-- border -->
  </div> <!-- container -->
</template>


<script>
import cardUtil from '../util/cardUtil.js'

import ManaCost from './ManaCost'
import OracleText from './OracleText'


export default {
  name: 'CardFace',

  components: {
    ManaCost,
    OracleText,
  },

  props: {
    card: {
      type: Object,
      default: {},
    },
    index: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    face() {
      if (this.card.card_faces) {
        return Object.assign({}, this.card, this.card.card_faces[this.index])
      }
      else {
        return this.card
      }
    },

    achievements() {
      return []
    },

    containerClasses() {
      const classes = []

      if (this.face.scarred) {
        classes.push('scarred')
      }

      const frameColor = cardUtil.frameColor(this.face)
      classes.push(`${frameColor}-card`)

      return classes
    },

    flavorText() {
      return this.face.flavor_text
    },

    imageUrl() {
      return this.face.image_uris.art_crop
    },

    manaCost() {
      return this.face.mana_cost
    },

    oracleText() {
      return this.face.oracle_text
    },

    setIcon() {
      return ''
    },

    powerToughness() {
      if (this.face.power) {
        return `${this.face.power}/${this.face.toughness}`
      }
      else if (this.face.loyalty) {
        return this.face.loyalty
      }
      else {
        return ''
      }
    },

    rarity() {
      return this.face.rarity
    },
  },
}
</script>