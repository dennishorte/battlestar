<template>
  <div class="main-crisis">
    <div class="description">

      <b-row>
        <b-col>
          <CrisisCard v-if="card.name" :card="card" />
        </b-col>

        <b-col v-if="isSkillCheck">
          <span class="faint font-italic ml-2">
            in order of adding cards
          </span>

          <div
            v-for="player in playersOrdered"
            :key="player.name"
          >
            <div class="heading">{{ player.name }}</div>
            <div class="indented">
              <span v-if="!!discussion[player.name].support">
                {{ discussion[player.name].support }}
              </span>
              <span v-else class="faint">
                waiting
              </span>

              <span v-if="cardsAdded[player.name].submitted">
                {{ cardsAdded[player.name].numAdded }}
              </span>
              <span v-else class="faint">
                waiting
              </span>
            </div>
          </div>

        </b-col>
      </b-row>
    </div>


  </div>
</template>


<script>
import CrisisCard from './CrisisCard'

import { util } from 'battlestar-common'

export default {
  name: 'CrisisPanel',

  components: {
    CrisisCard,
  },

  computed: {
    card() {
      return this.$game.getCrisis() || {}
    },

    cardsAdded() {
      return this.$game.getSkillCheck().addCards
    },

    discussion() {
      return this.$game.getSkillCheck().discussion
    },

    isSkillCheck() {
      return this.card
          && (this.card.type === 'Skill Check' || this.card.type === 'Optional Skill Check')
    },

    playersOrdered() {
      const players = util.deepcopy(this.$game.getPlayerAll())
      const activePlayer = this.$game.getPlayerCurrentTurn()
      while (players[players.length - 1].name !== activePlayer.name) {
        players.push(players.shift())
      }

      return players
    },
  },
}
</script>


<style scoped>
.description {
  color: #444;
  font-size: .7em;
}

.faint {
  color: #ccc;
}

.indented {
  margin-left: .5em;
  margin-bottom: .25em;
  margin-top: -.25em;
}
</style>
