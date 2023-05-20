<template>
  <div :class="containerClasses" :data-face-index="index">
    <div class="card-border">
      <div class="card-background">
        <div class="card-frame">

          <div class="frame-header frame-foreground" data-edit-field="header">
            <div class="frame-card-name">{{ face.name }}</div>

            <div class="frame-mana-cost">
              <ManaCost :cost="manaCost" />
            </div>
          </div>

          <img
            class="frame-art"
            data-edit-field="image-url"
            alt="card art"
            :src="imageUrl" />

          <div class="frame-type-line frame-foreground" data-edit-field="type-line">
            <div class="frame-card-type">{{ face.type_line }}</div>
            <div class="frame-card-icon" :class="rarity">{{ setIcon }}</div>
          </div>

          <div class="frame-text-box" data-edit-field="text-box">
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

          <div class="frame-pt-loyalty frame-foreground" data-edit-field="loyalty" v-if="powerToughness">
            {{ powerToughness }}
          </div>

        </div> <!-- frame -->
      </div> <!-- background -->
    </div> <!-- border -->
  </div> <!-- container -->
</template>


<script>
import { mag } from 'battlestar-common'

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
    size: {
      type: Number,
      default: 200,
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
      const classes = [
        'card-container',
        `card-container-${this.size}px`
      ]

      if (this.face.scarred) {
        classes.push('scarred')
      }

      const frameColor = mag.util.card.frameColor(this.face)
      classes.push(`${frameColor}-card`)

      return classes
    },

    flavorText() {
      return this.face.flavor_text
    },

    imageUrl() {
      return this.face.image_uri
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
      else if (this.face.type_line.includes('Siege') && this.face.defense) {
        return this.face.defense
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
