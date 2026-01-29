<template>
  <ModalBase id="achievement-modal">
    <template #header>{{ title }}</template>
    <CardText :text="text" />
  </ModalBase>
</template>


<script>
import CardText from './CardText.vue'
import ModalBase from '@/components/ModalBase.vue'

export default {
  name: 'CardsViewerModal',

  components: {
    CardText,
    ModalBase,
  },

  props: {
    card: {
      type: Object,
      default: null,
    },
  },

  computed: {
    text() {
      return this.card?.text
    },

    title() {
      return this.card?.name
    },
  },
}
</script>


<style scoped>
</style>
