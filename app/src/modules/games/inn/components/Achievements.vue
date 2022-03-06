<template>
  <div class="achievements">
    <CardPile :zone="zone" />
  </div>
</template>

<script>
import CardPile from './CardPile'

export default {
  name: 'Achievements',

  components: {
    CardPile,
  },

  inject: ['game'],

  computed: {
    zone() {
      return this.game.getZoneById('achievements')
    },
  },
}
</script>


<style scoped>

</style>
