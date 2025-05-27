<template>
  <div :class="containerClasses">
    <div class="card-border">
      <div class="card-background">
        <div class="card-frame">

          <div class="frame-header frame-foreground">
            <EditableDiv
              :text="card.name(index)"
              :custom-classes="['frame-card-name']"
              :editable="isEditable"
              field="name"
              @update="updateCardField" />

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

          <div>
            <EditableDiv
              :text="card.imageUri(index)"
              :custom-classes="['frame-art']"
              :editable="isEditable"
              field="image_uri"
              :renderComponent="true"
              @update="updateCardField">
              <template v-slot:default="slotProps">
                <div class="frame-art-wrapper">
                  <img
                    v-if="!isSplitCard"
                    class="frame-art"
                    alt="card art"
                    :src="slotProps.text" />
                  <img
                    v-else
                    class="frame-art split-card-art"
                    :class="{'split-left': index === 0, 'split-right': index === 1}"
                    alt="card art"
                    :src="slotProps.text" />
                </div>
              </template>
              <template v-slot:empty>
                <div class="frame-art empty-art"/>
              </template>
            </EditableDiv>
          </div>

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

            <div class="frame-flavor-wrapper">
              <EditableDiv
                :text="card.flavorText(index)"
                :custom-classes="['frame-flavor-text']"
                :editable="isEditable"
                field="flavor_text"
                @update="updateCardField">
                <template v-slot:empty>
                  <span class="placeholder-text">tasty</span>
                </template>
              </EditableDiv>
            </div>

            <div class="frame-achievements-wrapper">
              <p v-for="ach of achievements" :key="ach.unlock" class="frame-achievement-desc">
                <i class="bi bi-star-fill achievement-icon"/>
                {{ ach.unlock }}
              </p>
            </div>
          </div>

          <!-- The loyalty > 0 check covers flip walkers who don't have loyalty on their second side. -->
          <div class="frame-loyalty" v-if="card.isPlaneswalker(index) && card.loyalty(index) > 0">
            <CardLoyalty :face="face" @value-updated="updateCardField" />
          </div>

          <div class="frame-defense" v-if="card.isSiege(index)">
            <EditableDiv
              :text="card.defense(index)"
              :custom-classes="['frame-defense']"
              :editable="isEditable"
              field="defense"
              :renderComponent="true"
              @update="updateCardField">
              <template v-slot:default="slotProps">
                <CardDefense :defense="slotProps.text" />
              </template>
            </EditableDiv>
          </div>

          <div class="frame-power-toughness frame-foreground" v-if="card.isCreature(index)">
            <EditableDiv
              :text="card.power(index)"
              :custom-classes="['frame-power']"
              :editable="isEditable"
              field="power"
              @update="updateCardField" />
            <span class="power-toughness-separator">/</span>
            <EditableDiv
              :text="card.toughness(index)"
              :custom-classes="['frame-toughness']"
              :editable="isEditable"
              field="toughness"
              @update="updateCardField" />
          </div>

        </div> <!-- frame -->
      </div> <!-- background -->

      <div class="artist-name">
        <span class="artist-icon"><i class="ms ms-artist-nib"/></span>
        <EditableDiv
          :text="card.artist(index)"
          :custom-classes="['artist-text']"
          :editable="isEditable"
          field="artist"
          @update="updateCardField" />
      </div>

    </div> <!-- border -->
  </div> <!-- container -->
</template>


<script>
import ManaCost from './ManaCost'
import OracleText from './OracleText'
import EditableDiv from './EditableDiv'
import CardLoyalty from './CardLoyalty'
import CardDefense from './CardDefense'


export default {
  name: 'CardFace',

  components: {
    ManaCost,
    OracleText,
    EditableDiv,
    CardLoyalty,
    CardDefense,
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

.artist-name {
  display: flex;
  align-items: center;
}

.artist-icon {
  display: inline-flex;
  margin-right: 4px;
}

.color-indicator-and-type {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.empty-art {
  background-color: #ccc;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.split-card-art {
  width: 100%;
  height: 100%;
  max-width: none;
  clip-path: inset(0 50% 0 0);
}

.split-left {
  clip-path: inset(0 50% 0 0);
}

.split-right {
  clip-path: inset(0 0 0 50%);
}

.placeholder-text {
  /* opacity: 0.3; */
}

.frame-art-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 140px;
}

.frame-art {
  width: 100%;
  height: auto;
  display: block;
}

.split-card-art.split-left {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  object-position: 0% center;
  transform-origin: left center;
}

.split-card-art.split-right {
  position: absolute;
  top: 0;
  left: -100%;
  width: 200%;
  object-position: 100% center;
  transform-origin: right center;
}
</style>
