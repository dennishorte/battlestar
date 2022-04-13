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
      if (this.card.isRelic) {
        this.game.ui.modals.cardsViewer.title = ''
        this.game.ui.modals.cardsViewer.cards = [this.card]
        this.$bvModal.show('cards-viewer-modal')
      }
      else if (this.card.isSpecialAchievement) {
        this.game.ui.modals.achievement.card = this.card
        this.$bvModal.show('achievement-modal')
      }
    }
  }
}
</script>
