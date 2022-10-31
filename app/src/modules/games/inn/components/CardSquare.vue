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

  inject: {
    game: {
      from: 'game',
      default: null
    },
  },

  props: {
    card: Object,
  },

  computed: {
    displayName() {
      if (this.card.isRelic) {
        return this.card.getAge().toString() + "'"
      }
      else if (this.card.isSpecialAchievement) {
        return this.card.shortName
      }
      else {
        return this.card.getAge().toString()
      }
    },

    sizeClass() {
      if (this.card.isRelic) {
        return 'card-square'
      }
      else if (this.card.isSpecialAchievement) {
        return 'card-rect'
      }
      else {
        return 'card-square'
      }
    },
  },

  methods: {
    closeup() {
      if (!this.game) {
        return
      }

      if (this.card.isRelic) {
        this.game.ui.modals.cardsViewer.title = ''
        this.game.ui.modals.cardsViewer.cards = [this.card]
        this.$modal('cards-viewer-modal').show()
      }
      else if (this.card.isSpecialAchievement) {
        this.game.ui.modals.achievement.card = this.card
        this.$modal('achievement-modal').show()
      }
    }
  }
}
</script>
