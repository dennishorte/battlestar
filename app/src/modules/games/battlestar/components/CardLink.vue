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
    },
  },
}
</script>


<style scoped>
</style>
