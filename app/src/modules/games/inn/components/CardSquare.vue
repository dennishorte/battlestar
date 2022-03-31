<template>
  <div @click="closeup">
    <CardSquareDetails
      :name="displayName"
      :expansion="card.expansion"
      :sizeClass="sizeClass"
    />
  </div>
</template>


<script>
import CardSquareDetails from './CardSquareDetails'

export default {
  name: 'CardSquare',

  components: {
    CardSquareDetails,
  },

  inject: ['game'],

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

  methods: {
    closeup() {
      if (this.card.isSpecialAchievement) {
        this.game.ui.modals.achievement.card = this.card
        this.$bvModal.show('achievement-modal')
      }
    }
  }
}
</script>
