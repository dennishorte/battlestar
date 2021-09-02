<template>
  <div class="players">
    <div class="heading">
      Players
    </div>

    <b-list-group class="players-list">
      <PlayerListItem
        v-for="player in players"
        :key="player._id"
        :player="player"
      />
    </b-list-group>

  </div>
</template>


<script>
import PlayerListItem from './PlayerListItem'

export default {
  name: "Players",

  components: {
    PlayerListItem,
  },

  computed: {
    players() {
      return this.$store.state.bsg.game.players
    },
  },
}
</script>
