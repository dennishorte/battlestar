<template>
  <div class="achievements">
    <CardPile
      :zone="zone"
      :header="header()"
    />
  </div>
</template>

<script>
import CardPile from './CardPile'

export default {
  name: 'AchievementsZone',

  components: {
    CardPile,
  },

  inject: ['game'],

  computed: {
    zone() {
      return this.game.getZoneById('achievements')
    },
  },

  methods: {
    header() {
      return () => {
        const count = this.game.getNumAchievementsToWin()
        return `achievements [${count} to win]`
      }
    }
  },
}
</script>


<style scoped>

</style>
