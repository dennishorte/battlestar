<template>
  <div :class="containerClasses">
    <div class="card-border">
      <div class="card-background">
        <div class="card-frame">

          <div class="frame-header frame-foreground">
            <CardName
              :face="face"
              :isEditable="isEditable"
              @value-updated="updateCardField" />
            <CardManaCost
              :card="card"
              :index="index"
              :isEditable="isEditable"
              @show-color-picker="showColorPicker" />
          </div>

          <CardArt
            :card="card"
            :index="index"
            :isEditable="isEditable"
            @value-updated="updateCardField" />

          <div class="frame-type-line frame-foreground">
            <div class="color-indicator-and-type" style="width: 100%;">
              <CardColorIndicator
                :card="card"
                :index="index"
                :isEditable="isEditable"
                @show-color-picker="show-color-picker" />
              <CardTypeLine
                :face="face"
                :isEditable="isEditable"
                @value-updated="updateCardField" />
            </div>
            <div class="frame-card-icon" :class="card.rarity(index)">{{ '' }}</div>
          </div>

          <div class="frame-text-box">
            <CardOracleText
              :card="card"
              :index="index"
              :isEditable="isEditable"
              @value-updated="updateCardField" />
            <CardFlavorText
              :face="face"
              :isEditable="isEditable"
              @value-updated="updateCardField" />

            <div class="frame-achievements-wrapper">
              <p v-for="ach of achievements" :key="ach.unlock" class="frame-achievement-desc">
                <i class="bi bi-star-fill achievement-icon"/>
                {{ ach.unlock }}
              </p>
            </div>
          </div>

          <CardLoyalty
            :card="card"
            :index="index"
            :isEditable="isEditable"
            @value-updated="updateCardField" />
          <CardDefense
            :face="face"
            :isEditable="isEditable"
            @value-updated="updateCardField" />
          <CardPowerToughness
            :face="face"
            :isEditable="isEditable"
            @value-updated="updateCardField" />

        </div> <!-- frame -->
      </div> <!-- background -->

      <CardArtist
        :face="face"
        :isEditable="isEditable"
        @value-updated="updateCardField" />

    </div> <!-- border -->
  </div> <!-- container -->
</template>


<script>
import CardArt from './CardArt.vue'
import CardArtist from './CardArtist.vue'
import CardColorIndicator from './CardColorIndicator.vue'
import CardDefense from './CardDefense.vue'
import CardFlavorText from './CardFlavorText.vue'
import CardLoyalty from './CardLoyalty.vue'
import CardManaCost from './CardManaCost.vue'
import CardName from './CardName.vue'
import CardOracleText from './CardOracleText.vue'
import CardPowerToughness from './CardPowerToughness.vue'
import CardTypeLine from './CardTypeLine.vue'


export default {
  name: 'CardFace',

  components: {
    CardArt,
    CardArtist,
    CardColorIndicator,
    CardDefense,
    CardFlavorText,
    CardLoyalty,
    CardManaCost,
    CardName,
    CardOracleText,
    CardPowerToughness,
    CardTypeLine,
  },

  emits: ['show-color-picker', 'update-face'],

  props: {
    card: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      default: 0,
    },
    size: {
      type: Number,
      default: 200,
    },
    forceLoyalty: {
      type: Boolean,
      default: false,
    },
    isEditable: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    achievements() {
      return []
    },

    containerClasses() {
      const classes = [
        'card-container',
        `card-container-${this.size}px`
      ]

      if (this.card.isScarred(this.index)) {
        classes.push('scarred')
      }

      const frameColor = this.card.frameColor(this.index)
      classes.push(`${frameColor}-card`)

      if (this.isSplitCard) {
        classes.push('split-card-container')
      }

      return classes
    },

    face() {
      return this.card.face(this.index)
    },

    isSplitCard() {
      return this.card.layout() === 'split'
    },
  },

  methods: {
    showColorPicker() {
      this.$emit('show-color-picker', this.index)
    },

    updateCardField({ field, value }) {
      this.$emit('update-face', {
        index: this.index,
        field,
        value
      })
    },
  },
}
</script>


<style scoped>
div {
  position: relative;
}

.achievement-icon {
  color: gold;
  background-color: black;
  font-size: 1.5em;
  padding: 2px 3px;
  border-radius: 50%;
}

.color-indicator-and-type {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
