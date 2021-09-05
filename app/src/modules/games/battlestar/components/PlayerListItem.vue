<template>
  <b-list-group-item
    @click="playerShow"
    class="player-list-item"
    :class="playerClasses()">

    <div class="name-row">
      <div>
        {{ player.name }}
      </div>

      <div>
        <span v-if="isAdmiral">A</span>
        <span v-if="isPresident">P</span>
        <span>*</span>
      </div>
    </div>

    <div class='player-character-name'>
      <CharacterLink :name="player.character" />
    </div>

    <div class="cylon-status">
      <div v-if="isCylon" class="you-are-a-cylon">
        you are a cylon
      </div>

      <div v-else-if="hasLoyaltyCard" class="you-are-a-human">
        you are human
      </div>
    </div>
  </b-list-group-item>
</template>


<script>
import CharacterLink from './CharacterLink'

export default {
  name: "Players",

  props: {
    player: Object,
  },

  components: {
    CharacterLink,
  },

  computed: {
    hasLoyaltyCard() {
      return false
      /* return (
       *   this.player._id === this.$store.state.auth.user._id
       *   && this.player.loyaltyCards.length > 0
       * ) */
    },
    isAdmiral() {
      const admiral = this.$store.state.bsg.game.titles.admiral
      return admiral && admiral === this.player.character
    },
    isCylon() {
      return false
      /* return (
       *   this.player._id === this.$store.state.auth.user._id
       *   && this.player.loyaltyCards.some(c => c.name === 'You Are a Cylon')
       * ) */
    },
    isPresident() {
      const president = this.$store.state.bsg.game.titles.president
      return president && president === this.player.character
    },
  },

  methods: {
    playerClasses() {
      const classes = [`player-${this.player.index}`]
      if (this.isAdmiral) classes.push('admiral')
      if (this.isPresident) classes.push('president')
      if (this.player.active) classes.push('active-player')
      return classes
    },

    playerShow() {
      this.$store.commit('bsg/playerShow', this.player._id)
      this.$bvModal.show('player-modal')
    },
  },
}
</script>


<style scoped>
.active-player {
  background-color: #fef;
}

.cylon-status {
  font-size: .7em;
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

.you-are-a-cylon {
  color: red;
}

.you-are-a-human {
  color: blue;
}
</style>
