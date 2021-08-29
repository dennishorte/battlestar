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

      <div class="name-row">
        <div>
          {{ player.name }}
        </div>

        <div>
          <span v-show="player.admiral">A</span>
          <span v-show="player.president">P</span>
          <span>{{ player.skillCards.length }}</span>
        </div>
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

  computed: {
    players() {
      return this.$store.state.bsg.game.players
    },
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

.list-group-item {
    padding: .3rem .7rem;
}

.name-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.name-row span {
    margin-left: .25em;
}

.player-character-name {
    font-size: .7em;
    margin-left: 1em;
    margin-top: -.5em;

    height: 1.2em;
    width: 100%;
    overflow: hidden;
}
</style>
