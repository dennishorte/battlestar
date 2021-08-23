<template>
<div class="players">
  <div class="heading">
    Players
  </div>

  <b-list-group class="players-list">
    <b-list-group-item
      v-for="player in players"
      :key="player._id"
      :class="playerClasses(player)">
      <div v-show="player.admiral" style="float: right;">
        A
      </div>
      <div v-show="player.president" style="float: right;">
        P
      </div>
      {{ player.name }}
    </b-list-group-item>
  </b-list-group>
</div>
</template>


<script>
export default {
  name: "Players",

  props: {
    players: Array,
  },

  methods: {
    playerClasses(player) {
      const classes = [`player-${player.index}`]
      if (player.admiral) classes.push('admiral')
      if (player.president) classes.push('president')
      if (player.active) classes.push('active-player')
      return classes
    },
  },
}
</script>


<style>
.active-player {
    background-color: #fef;
}
</style>
