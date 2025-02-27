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
    player: Object
  },

  computed: {
    cards() {
      return this.game.getAchievementsByPlayer(this.player).other.map(card => card.name)
    },
  },
}
</script>
