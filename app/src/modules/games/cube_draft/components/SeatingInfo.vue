<template>
  <div class="seating-info">

    <div class="heading">Seating Chart</div>

    <div v-for="info in playerInfo" :key="info.player.name">
      <span class="name-span">{{ info.player.name }}</span>
      <span v-for="count in info.waitingPacks" class="count-span">
        &nbsp{{ count }}
      </span>
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


<style scoped>
.name-span {
  display: inline-block;
  min-width: 50px;
  max-width: 50px;
}
</style>
