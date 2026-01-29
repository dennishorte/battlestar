<template>
  <div class="card-stacked">

    <CardFull v-if="isTop" :card="card" />
    <CardCollapsed v-else :card="card" />

  </div>
</template>


<script>
import CardCollapsed from './CardCollapsed.vue'
import CardFull from './CardFull.vue'

export default {
  name: 'CardStacked',

  components: {
    CardCollapsed,
    CardFull,
  },

  inject: ['game'],

  props: {
    card: {
      type: Object,
      required: true
    },
  },

  computed: {
    isTop() {
      return this.card.isTopCardStrict()
    },
  },
}
</script>
