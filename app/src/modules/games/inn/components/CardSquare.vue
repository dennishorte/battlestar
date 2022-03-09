<template>
  <CardSquareDetails
    :name="displayName"
    :expansion="card.expansion"
    :sizeClass="sizeClass"
  />
</template>


<script>
import CardSquareDetails from './CardSquareDetails'

export default {
  name: 'CardSquare',

  components: {
    CardSquareDetails,
  },

  props: {
    card: Object,
  },

  computed: {
    displayName() {
      return this.card.isSpecialAchievement ? this.card.shortName : this.card.age.toString()
    },

    sizeClass() {
      return this.card.isSpecialAchievement ? 'card-rect' : 'card-square'
    },
  },
}
</script>
