<template>
  <div @click="closeup($event)">
    <CardSquareDetails
      :name="displayName"
      :expansion="card.expansion"
      :sizeClass="sizeClass"
    />
  </div>
</template>


<script>
import CardSquareDetails from './CardSquareDetails.vue'

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
    card: {
      type: Object,
      required: true
    },
  },

  computed: {
    displayName() {
      if (this.card.isSpecialAchievement || this.card.isMuseum || this.card.isDecree) {
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
    closeup(event) {
      if (!this.game) {
        return
      }

      if (this.card.isSpecialAchievement || this.card.isDecree) {
        event.stopPropagation()
        this.game.ui.modals.achievement.card = this.card
        this.$modal('achievement-modal').show()
      }
    }
  }
}
</script>
