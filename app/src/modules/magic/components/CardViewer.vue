<template>
  <div class="card-viewer">
    <MagicWrapper>
      <MagicCard :card="card" :size="270" />
    </MagicWrapper>
  </div>
</template>


<script>
import MagicCard from './MagicCard'
import MagicWrapper from './MagicWrapper'

export default {
  name: 'CardViewer',

  components: {
    MagicCard,
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
