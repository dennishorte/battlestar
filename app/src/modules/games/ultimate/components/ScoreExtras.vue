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
    player: {
      type: Object,
      required: true
    }
  },

  computed: {
    biscuits() {
      return this
        .player
        .bonuses()
        .map(bonus => {
          switch (bonus) {
            case 10: return 'a'
            case 11: return 'b'
            default: return bonus.toString()
          }
        })
    },
  },
}
</script>
