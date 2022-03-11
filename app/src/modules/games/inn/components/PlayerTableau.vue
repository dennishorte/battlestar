<template>
  <div class="player-tableau">
    {{ player.name }}

    <ColorStack
      v-for="color in game.utilColors()"
      :key="color"
      :player="player"
      :color="color"
    />

    <CardPile
      v-for="zoneName in ['achievements', 'score', 'forecast', 'hand']"
      :key="zoneName"
      :zone="game.getZoneByPlayer(player, zoneName)"
      :expanded="zoneName === 'hand' && player.name === actor.name"
    />
  </div>
</template>

<script>
import CardPile from './CardPile'
import ColorStack from './ColorStack'

export default {
  name: 'PlayerTableau',

  components: {
    CardPile,
    ColorStack,
  },

  inject: ['actor', 'game'],

  props: {
    player: Object,
  },
}
</script>
