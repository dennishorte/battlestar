<template>
  <b-modal id="achievement-modal" class="achievement-modal" :title="title">
    {{ text }}
  </b-modal>
</template>


<script>
export default {
  name: 'CardsViewerModal',

  inject: ['game'],

  computed: {
    text() {
      return this.game.ui.modals.achievement.card.text
    },

    title() {
      return this.game.ui.modals.achievement.card.name
    },
  },
}
</script>


<style scoped>
</style>
