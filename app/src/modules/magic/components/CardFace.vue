<template>
  <div :class="containerClasses">
    <div class="card-border">
      <div class="card-background">
        <div class="card-frame">

          <div class="frame-header frame-foreground">
            <EditableDiv
              :text="card.name(index)"
              customClass="frame-card-name"
              :editable="true"
              field="name"
              @update="updateCardField" />

            <div class="frame-mana-cost">
              <EditableDiv
                :text="manaCost"
                customClass="frame-mana-cost"
                :editable="true"
                field="mana_cost"
                :renderComponent="true"
                @update="updateCardField">
                <template v-slot:default="slotProps">
                  <ManaCost :cost="slotProps.text" />
                </template>
                <template v-slot:empty>
                  <i class="ms ms-2x ms-ci ms-ci-5 empty-mana-indicator"></i>
                </template>
              </EditableDiv>
            </div>
          </div>

          <div>
            <EditableDiv
              :text="imageUrl"
              customClass="frame-art"
              :editable="true"
              field="image_uri"
              :renderComponent="true"
              @update="updateCardField">
              <template v-slot:default="slotProps">
                <img
                  class="frame-art"
                  alt="card art"
                  :src="slotProps.text" />
              </template>
              <template v-slot:empty>
                <div class="frame-art empty-art"></div>
              </template>
            </EditableDiv>
          </div>

          <div class="frame-type-line frame-foreground">
            <EditableDiv
              :text="card.typeLine(index)"
              customClass="frame-card-type"
              :editable="true"
              field="type_line"
              @update="updateCardField" />
            <div class="frame-card-icon" :class="rarity">{{ setIcon }}</div>
          </div>

          <div class="frame-text-box">
            <EditableDiv
              :text="oracleText"
              customClass="frame-oracle-text"
              :editable="true"
              field="oracle_text"
              :renderComponent="true"
              @update="updateCardField">
              <template v-slot:default="slotProps">
                <OracleText :text="slotProps.text" />
              </template>
            </EditableDiv>

            <div class="frame-flavor-wrapper">
              <EditableDiv
                :text="flavorText"
                customClass="frame-flavor-text"
                :editable="true"
                field="flavor_text"
                @update="updateCardField">
                <template v-slot:empty>
                  <span class="placeholder-text">tasty</span>
                </template>
              </EditableDiv>
            </div>

            <div class="frame-achievements-wrapper">
              <p v-for="ach of achievements" class="frame-achievement-desc">
                <i class="bi bi-star-fill achievement-icon"></i>
                {{ ach.unlock }}
              </p>
            </div>
          </div>

          <div class="frame-loyalty" v-if="loyalty">
            <EditableDiv
              :text="loyalty"
              customClass="frame-loyalty"
              :editable="true"
              field="loyalty"
              :renderComponent="true"
              @update="updateCardField">
              <template v-slot:default="slotProps">
                <CardLoyalty :loyalty="slotProps.text" />
              </template>
            </EditableDiv>
          </div>

          <div class="frame-defense" v-if="defense">
            <EditableDiv
              :text="defense"
              customClass="frame-defense"
              :editable="true"
              field="defense"
              :renderComponent="true"
              @update="updateCardField">
              <template v-slot:default="slotProps">
                <CardDefense :defense="slotProps.text" />
              </template>
            </EditableDiv>
          </div>

          <div class="frame-power-toughness frame-foreground" v-if="power || toughness">
            <EditableDiv
              :text="power"
              customClass="frame-power"
              :editable="true"
              field="power"
              @update="updateCardField" />
            <span class="power-toughness-separator">/</span>
            <EditableDiv
              :text="toughness"
              customClass="frame-toughness"
              :editable="true"
              field="toughness"
              @update="updateCardField" />
          </div>

        </div> <!-- frame -->
      </div> <!-- background -->

      <div class="artist-name">
        <span class="artist-icon"><i class="ms ms-artist-nib"></i></span>
        <EditableDiv
          :text="card.artist(index)"
          customClass="artist-text"
          :editable="true"
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
    forceLoyalty: {
      type: Boolean,
      default: false,
    },
    isEditable: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    updateCardField({ field, value }) {
      this.$emit('update-face', {
        index: this.index,
        field,
        value
      });
    }
  },

  computed: {
    achievements() {
      return this.$store.getters['magic/cube/achievementsForCard'](this.card)
    },

    containerClasses() {
      const classes = [
        'card-container',
        `card-container-${this.size}px`
      ]

      if (this.card.isScarred()) {
        classes.push('scarred')
      }

      const frameColor = this.card.frameColor(this.index)
      classes.push(`${frameColor}-card`)

      return classes
    },

    flavorText() {
      return this.card.flavorText(this.index)
    },

    imageUrl() {
      return this.card.imageUri(this.index)
    },

    manaCost() {
      return this.card.manaCost(this.index)
    },

    oracleText() {
      return this.card.oracleText(this.index)
    },

    setIcon() {
      return ''
    },

    defense() {
      return this.card.defense(this.index)
    },

    loyalty() {
      return this.card.loyalty(this.index)
    },

    power() {
      return this.card.power(this.index)
    },

    toughness() {
      return this.card.toughness(this.index)
    },

    rarity() {
      return this.card.rarity(this.index)
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

.empty-mana-indicator {
  opacity: 0.1;
}

.empty-art {
  background-color: #ccc;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  /* opacity: 0.3; */
}
</style>
