<template>
  <div class="seating-info">

    <div v-for="info in playerInfo" :key="info.player.name">
      {{ info.player.name }} {{ info.waitingPacks[0] }} {{ info.waitingPacks[1] }}
    </div>

  </div>
</template>


<script>
export default {
  name: 'SeatingInfo',

  inject: ['game'],

  computed: {
    playerInfo() {
      return this
        .game
        .getPlayerAll()
        .map(player => {
          const waitingPacks = []
          for (let i = 0; i < this.game.settings.numPacks; i++) {
            const waiting = this
              .game
              .state
              .packs
              .filter(pack => pack.index === i)
              .filter(pack => pack.waiting === player)
              .length
            waitingPacks.push(waiting)
          }

          return {
            player,
            waitingPacks,
          }
        })
    },
  },
}
</script>
