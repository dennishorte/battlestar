<template>
  <span>
    <CardBiscuit v-for="(extra, index) in biscuits" :key="index" :biscuit="extra" />
  </span>
</template>


<script>
import CardBiscuit from './CardBiscuit'

export default {
  name: 'ScoreExtras',

  components: {
    CardBiscuit,
  },

  inject: ['game'],

  props: {
    player: Object
  },

  computed: {
    biscuits() {
      return this
        .game
        .getBonuses(this.player)
        .map(bonus => bonus.toString())
    },
  },
}
</script>
