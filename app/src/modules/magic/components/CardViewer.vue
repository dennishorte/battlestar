<template>
  <div class="card-viewer">
    <MagicWrapper>
      <MagicCard :card="card" :size="270" />
    </MagicWrapper>
  </div>
</template>


<script>
import MagicCard from '@/modules/magic/components/card/MagicCard.vue'
import MagicWrapper from '@/modules/magic/components/MagicWrapper.vue'

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
