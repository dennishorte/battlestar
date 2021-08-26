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

      <div>
        {{ player.name }}
      </div>

      <div class='player-character-name'>
        <CharacterLink :name="player.character" />
      </div>
    </b-list-group-item>
  </b-list-group>
</div>
</template>


<script>
import CharacterLink from './CharacterLink'

export default {
  name: "Players",

  components: {
    CharacterLink,
  },

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


<style scoped>
.active-player {
    background-color: #fef;
}

.player-character-name {
    font-size: .7em;
    margin-left: 1em;
    line-height: .3;
}
</style>
