<template>
  <MagicWrapper>
    <Card :card="card" :size="270" />
  </MagicWrapper>
</template>


<script>
import Card from './Card'
import MagicWrapper from './MagicWrapper'

export default {
  name: 'CardViewer',

  components: {
    Card,
    MagicWrapper,
  },

  data() {
    return {
      cardDatabaseId: this.$route.params.id,
    }
  },

  computed: {
    card() {
      return this.$store.getters['magic/cards/byDatabaseId'](this.cardDatabaseId)
    }
  },
}
</script>
