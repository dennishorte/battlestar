<template>
  <div class="seating-info">

    <div class="heading">Seating Chart</div>

    <div v-for="info in playerInfo" :key="info.player.name" class="player-info">
      <div class="name-div">{{ info.player.name }}</div>
      <div v-for="count in info.waitingPacks" :key="count" class="count-div">
        &nbsp;{{ count }}
      </div>
      <div
        v-if="info.player.name !== actor.name"
        class="fight-div"
        @click="newGame(info.player)"
      >fight</div>
    </div>

  </div>
</template>


<script>
export default {
  name: 'SeatingInfo',

  inject: ['actor', 'game'],

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

  methods: {
    async newGame(opponent) {
      // Create a lobby for a new game.
      const { lobbyId } = await this.$post('/api/lobby/create', {
        userIds: [this.actor._id, opponent._id],
        game: 'Magic',
        options: {
          format: 'Constructed',
          linkedDraftId: this.game._id,
        },
      })

      // Redirect to the new lobby.
      this.$router.push(`/lobby/${lobbyId}`)
    },
  },
}
</script>


<style scoped>
.fight-div {
  color: #0000EE;
  margin-left: 10px;
}

.name-div {
  min-width: 50px;
  max-width: 50px;
}

.player-info {
  display: flex;
  flex-direction: row;
}
</style>
