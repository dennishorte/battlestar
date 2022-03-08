<template>
  <div class="color-stack">
    <div class="color-stack-header" :class="[color]">
      {{ zone.cards().length }} {{ zone.splay }}
    </div>

    <CardFull v-if="zone.cards().length > 0" :card="zone.cards()[0]" />
  </div>
</template>


<script>
import CardFull from './CardFull'

export default {
  name: 'ColorStack',

  components: {
    CardFull,
  },

  inject: ['game'],

  props: {
    player: Object,
    color: String,
  },

  computed: {
    zone() {
      return this.game.getZoneByPlayer(this.player, this.color)
    },
  },
}
</script>

<style scoped>
.color-stack-header {
  margin-left: .5rem;
  margin-right: .5rem;
  margin-top: .25rem;
  padding-left: .25rem;
  border-top: 1px solid black;
  border-right: 1px solid black;
  border-left: 1px solid black;
}
</style>
