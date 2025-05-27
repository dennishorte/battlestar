<template>
  <div :class="containerClasses">
    <div class="card-border">
      <div class="card-background">
        <div class="card-frame">

          <div class="frame-header frame-foreground">
            <CardName :face="face" @value-updated="updateCardField" />

            <div class="frame-mana-cost" @click="showColorPicker">
              <ManaCost
                v-if="card.manaCost(index).length > 0"
                :cost="card.manaCost(index)"
              />
              <i
                v-else-if="isEditable"
                class="ms ms-2x ms-ci ms-ci-5 opacity-10"
              />
            </div>
          </div>

          <CardArt
            :face="face"
            :isSplitCard="isSplitCard"
            :index="index"
            @value-updated="updateCardField" />

          <div class="frame-type-line frame-foreground">
            <div class="color-indicator-and-type">

              <div class="frame-color-indicator" @click="showColorPicker">

                <!-- ms-2x makes it easier for users to click when editing -->
                <i
                  v-if="card.hasColorIndicator(index)"
                  class="ms ms-ci"
                  :class="[
                    ...card.colorIndicatorClasses(index),
                    isEditable ? 'ms-2x' : '',
                  ]"
                />

                <!--
                     If there is no color indicator, show a generic all-color indicator when editing
                     so users can click on it to open the color picker.
                -->
                <i v-else-if="isEditable" class="ms ms-ci ms-ci-5 ms-2x opacity-10" />
              </div>

              <EditableDiv
                :text="card.typeLine(index)"
                :custom-classes="['frame-card-type']"
                :editable="isEditable"
                field="type_line"
                @update="updateCardField" />
            </div>
            <div class="frame-card-icon" :class="card.rarity(index)">{{ '' }}</div>
          </div>

          <div class="frame-text-box">
            <EditableDiv
              :text="card.oracleText(index)"
              :custom-classes="['frame-oracle-text']"
              :editable="isEditable"
              field="oracle_text"
              :renderComponent="true"
              @update="updateCardField">
              <template v-slot:default="slotProps">
                <OracleText :text="slotProps.text" />
              </template>
            </EditableDiv>

            <CardFlavorText :face="face" @value-updated="updateCardField" />

            <div class="frame-achievements-wrapper">
              <p v-for="ach of achievements" :key="ach.unlock" class="frame-achievement-desc">
                <i class="bi bi-star-fill achievement-icon"/>
                {{ ach.unlock }}
              </p>
            </div>
          </div>

          <CardLoyalty :face="face" @value-updated="updateCardField" />
          <CardDefense :face="face" @value-updated="updateCardField" />
          <CardPowerToughness :face="face" @value-updated="updateCardField" />

        </div> <!-- frame -->
      </div> <!-- background -->

      <CardArtist :face="face" @value-updated="updateCardField" />

    </div> <!-- border -->
  </div> <!-- container -->
</template>


<script>
import ManaCost from './ManaCost'
import OracleText from './OracleText'
import EditableDiv from './EditableDiv'
import CardLoyalty from './CardLoyalty'
import CardDefense from './CardDefense'
import CardPowerToughness from './CardPowerToughness'
import CardArtist from './CardArtist'
import CardFlavorText from './CardFlavorText'
import CardName from './CardName'
import CardArt from './CardArt'


export default {
  name: 'CardFace',

  components: {
    ManaCost,
    OracleText,
    EditableDiv,
    CardLoyalty,
    CardDefense,
    CardPowerToughness,
    CardArtist,
    CardFlavorText,
    CardName,
    CardArt,
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

.opacity-10 {
  opacity: 0.1;
}

.split-empty-left, .split-empty-right {
  position: relative;
  overflow: hidden;
}

.split-empty-left:after, .split-empty-right:after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  background-color: rgba(0, 0, 0, 0.1);
}

.split-empty-left:after {
  right: 0;
}

.split-empty-right:after {
  left: 0;
}
</style>
