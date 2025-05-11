<template>
  <ModalBase id="achievement-modal">
    <template #header>{{ title }}</template>
    <CardText :text="text" />
  </ModalBase>
</template>


<script>
import CardText from './CardText'
import ModalBase from '@/components/ModalBase'

export default {
  name: 'CardsViewerModal',

  components: {
    CardText,
    ModalBase,
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
