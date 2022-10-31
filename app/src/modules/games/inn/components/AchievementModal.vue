<template>
  <Modal id="achievement-modal">
    <template #title>{{ title }}</template>
    <CardText :text="text" />
  </Modal>
</template>


<script>
import CardText from './CardText'
import Modal from '@/components/Modal'

export default {
  name: 'CardsViewerModal',

  components: {
    CardText,
    Modal,
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
