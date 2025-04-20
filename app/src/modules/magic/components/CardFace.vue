<template>
  <div :class="containerClasses" :data-face-index="index">
    <div class="card-border">
      <div class="card-background">
        <div class="card-frame">

          <div class="frame-header frame-foreground editable" data-edit-field="header">
            <EditableDiv 
              :text="card.name(index)" 
              customClass="frame-card-name"
              :editable="true"
              field="name"
              @update="updateCardField" />

            <div class="frame-mana-cost">
              <ManaCost :cost="manaCost" />
            </div>
          </div>

          <div class="editable test" data-edit-field="image-url">
            <img
              class="frame-art"
              alt="card art"
              :src="imageUrl" />
          </div>

          <div class="frame-type-line frame-foreground editable" data-edit-field="type-line">
            <div class="frame-card-type">{{ card.typeLine(index) }}</div>
            <div class="frame-card-icon" :class="rarity">{{ setIcon }}</div>
          </div>

          <div class="frame-text-box editable" data-edit-field="text-box">
            <OracleText :text="oracleText" />

            <div class="frame-flavor-wrapper">
              <p v-if="flavorText" class="frame-flavor-text">{{ flavorText }}</p>
            </div>

            <div class="frame-achievements-wrapper">
              <p v-for="ach of achievements" class="frame-achievement-desc">
                <i class="bi bi-star-fill achievement-icon"></i>
                {{ ach.unlock }}
              </p>
            </div>
          </div>

          <div class="frame-pt-loyalty frame-foreground editable" data-edit-field="loyalty" v-if="loyalty">
            {{ loyalty }}
          </div>

        </div> <!-- frame -->
      </div> <!-- background -->

      <div class="artist-name editable" data-edit-field="image-url">
        <i class="ms ms-artist-nib"></i>
        {{ card.artist(index) }}
      </div>

    </div> <!-- border -->
  </div> <!-- container -->
</template>


<script>
import ManaCost from './ManaCost'
import OracleText from './OracleText'
import EditableDiv from './EditableDiv'


export default {
  name: 'CardFace',

  components: {
    ManaCost,
    OracleText,
    EditableDiv,
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

    loyalty() {
      if (this.card.power(this.index)) {
        return `${this.card.power(this.index)}/${this.card.toughness(this.index)}`
      }
      else if (this.card.loyalty(this.index)) {
        return this.card.loyalty(this.index)
      }
      else if (this.card.isSiege(this.index)) {
        return this.card.defense(this.index)
      }
      else {
        return ''
      }
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
</style>
