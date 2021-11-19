<template>
  <div class="expanded-card">
    <Variant :name="cardVariant">
      <Component :is="componentType" :card="card" />
    </Variant>
  </div>
</template>

<script>
import CardBasic from './CardBasic'
import CardCharacter from './CardCharacter'
import Variant from './Variant'

import variants from '../lib/variants.js'

export default {
  name: 'CardDecider',

  components: {
    Variant,
  },

  props: {
    card: Object,
  },

  computed: {
    cardVariant() {
      return this.isVisible ? variants.cardVariant(this.card) : ''
    },

    componentType() {
      const variantName = this.cardVariant
      const variant = variants.fetch(variantName)
      if (variant.component) {
        if (variant.component === 'character') {
          return CardCharacter
        }
        else {
          throw new Error(`Unknown card component: ${variant.component}`)
        }
      }
      else {
        return CardBasic
      }
    },

    isVisible() {
      return this.$game.checkCardIsVisible(this.card)
    },
  },
}
</script>


<style scoped>
.expanded-card:not(:first-of-type) {
  border-top: 1px solid darkgray;
}

.expanded-card >>> .expanded-card-inner {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: .25em;
}

.expanded-card >>> .hidden {
  color: #777;
  font-style: italic;
}
</style>
