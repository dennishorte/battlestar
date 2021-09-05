<template>
  <div class="skill-decks">

    <div
      v-for="skill in skillList"
      :key="skill"
      class="skill-deck-row"

    >

      <div
        class="skill-deck-name"
        :class="`skill-${skill}`"
      >
        {{ skill }}
      </div>

      <div>
        <b-button @click="draw(skill)">
          draw
        </b-button>
        <b-dropdown text="give" right>
          <b-dropdown-item
            @click="give(player._id, skill)"
            v-for="player in players"
            :key="player._id">
            {{ player.name }}
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </div>

  </div>
</template>


<script>
import bsgutil from '../lib/util.js'

export default {
  name: 'SkillDecks',

  data() {
    return {
      skillList: bsgutil.skillList,
    }
  },

  computed: {
    players() {
      return this.$store.getters['bsg/players']
    },
  },

  methods: {
    draw(skill) {
      const playerId = this.$store.getters['auth/userId']
      this.$store.commit('bsg/draw', {
        playerId,
        deckName: skill,
      })
      this.$bvToast.toast('drew: ' + skill, {
        autoHideDelay: 300,
        noCloseButton: true,
        solid: true,
      })
    },

    give(playerId, skill) {
      this.$store.commit('bsg/draw', {
        playerId,
        deckName: skill,
      })

      const playerName = this.$store.getters['bsg/playerById'](playerId).name
      this.$bvToast.toast(`game ${skill} to ${playerName}`, {
        autoHideDelay: 300,
        noCloseButton: true,
        solid: true,
      })
    },
  },
}
</script>


<style scoped>
.dropdown,
button {
  margin-left: .5em;
}

.skill-deck-name {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  flex-grow: 1;
  border-radius: .5em;
  border: 1px solid darkgray;
}

.skill-deck-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  margin-top: .25em;
}

.skill-decks {
  font-size: 1rem;
}
</style>
