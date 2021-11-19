<template>

  <div class="expanded-card-inner">
    <div :class="displayClasses">
      {{ displayName }}
    </div>
    <div>{{ displayExtra }}</div>
  </div>

</template>


<script>
import variants from '../lib/variants.js'

export default {
  name: 'CardBasic',

  props: {
    card: Object,
  },

  computed: {
    cardVariant() {
      return this.isVisible ? variants.cardVariant(this.card) : ''
    },

    displayClasses() {
      return this.isVisible ? [] : ['hidden']
    },

    displayExtra() {
      if (this.isVisible && this.card.kind === 'skill') {
        return this.card.value
      }
      else {
        return ''
      }
    },

    displayName() {
      return this.isVisible ? this.card.name : this.card.kind
    },

    isVisible() {
      return this.$game.checkCardIsVisible(this.card)
    },
  },
}
</script>


<style scoped>
</style>
