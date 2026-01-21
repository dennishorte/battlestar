<template>
  <span>
    <CardNameFull v-for="(extra, index) in cards" :key="index" :name="extra" />
  </span>
</template>


<script>
import CardNameFull from './CardNameFull'

export default {
  name: 'AchievementExtras',

  components: {
    CardNameFull,
  },

  inject: ['game'],

  props: {
    player: {
      type: Object,
      required: true
    }
  },

  computed: {
    cards() {
      return this.player.achievementCount().other.map(card => card.name)
    },
  },
}
</script>
