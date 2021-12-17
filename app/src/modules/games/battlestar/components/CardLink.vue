<template>
  <span
    @click="cardClicked"
    class="card-link">
    {{ card.name }}
  </span>
</template>


<script>
export default {
  name: 'CardLink',

  props: {
    card: Object,
  },

  methods: {
    cardClicked() {
      if (this.card.kind === 'crisis' || this.card.kind === 'superCrisis') {
        this.$game.ui.modal.crisisCards = this.card.name
        this.$bvModal.show('crisis-cards-modal')
      }

      else if (this.card.kind === 'character') {
        this.$game.ui.modal.characters = this.card.name
        this.$bvModal.show('characters-modal')
      }

      else if (this.card.kind === 'quorum') {
        this.$game.ui.modal.quorumCard = this.card.name
        this.$bvModal.show('quorum-cards-modal')
      }

      else if (this.card.kind === 'skill') {
        this.$game.ui.modal.skillCards = this.card.name
        this.$bvModal.show('skill-cards-modal')
      }
    },
  },
}
</script>


<style scoped>
</style>
