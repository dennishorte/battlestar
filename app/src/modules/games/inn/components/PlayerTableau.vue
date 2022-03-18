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
      :zone="game.getZoneByPlayer(player, 'achievements')"
      :header="countHeader(player, 'achievements')"
    />

    <CardPile
      :zone="game.getZoneByPlayer(player, 'score')"
      :header="scoreHeader(player)"
    />

    <CardPile
      :zone="game.getZoneByPlayer(player, 'forecast')"
      :header="countHeader(player, 'forecast')"
    />

    <CardPile
      :zone="game.getZoneByPlayer(player, 'hand')"
      :header="countHeader(player, 'hand')"
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

  methods: {
    countHeader(player, zoneName) {
      return () => {
        const count = this.game.getZoneByPlayer(player, zoneName).cards().length
        return `${zoneName} ${count}`
      }
    },

    scoreHeader(player) {
      return () => {
        const count = this.game.getZoneByPlayer(player, 'score').cards().length
        const total = this.game.getScore(player)
        return `score ${count} [${total}]`
      }
    }
  },
}
</script>
