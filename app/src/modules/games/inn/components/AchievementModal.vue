<template>
  <b-modal id="achievement-modal" class="achievement-modal" :title="title">
    <CardText :text="text" />
  </b-modal>
</template>


<script>
import CardText from './CardText'

export default {
  name: 'CardsViewerModal',

  components: {
    CardText
  },

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
