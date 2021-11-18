<template>
  <div class="skill-check-panel">
    <div class="description">

      <b-row>
        <b-col>
          <SkillCheck :data="check" :show-title="true" />
        </b-col>

        <b-col>
          <span class="faint font-italic ml-2">
            in order of adding cards
          </span>

          <div
            v-for="player in playersOrdered"
            :key="player.name"
          >
            <div class="heading">{{ player.name }}</div>
            <div class="indented">
              <span v-if="!!check.flags[player.name].support">
                {{ check.flags[player.name].support }}
              </span>
              <span v-else class="faint">
                waiting
              </span>

              <span v-if="check.flags[player.name].submitted.addCards">
                {{ check.flags[player.name].numAdded }}
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
import SkillCheck from './SkillCheck'
import { util } from 'battlestar-common'

export default {
  name: 'SkillCheckPanel',

  components: {
    SkillCheck,
  },

  computed: {
    check() {
      return this.$game.getSkillCheck()
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
