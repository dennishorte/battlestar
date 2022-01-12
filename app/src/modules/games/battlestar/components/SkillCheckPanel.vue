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

      <hr />

      <b-row v-if="cardsAdded.length > 0">
        <b-col>
          <div class="heading">Added Cards</div>
          <CardDecider v-for="card in cardsAdded" :key="card.id" :card="card" />
        </b-col>

        <b-col>
          <div class="heading">total:
            <span> {{ currentTotal }} </span>
          </div>
          <div class="heading">result:
            <span> {{ check.result }} </span>
          </div>
        </b-col>
      </b-row>

    </div>
  </div>
</template>


<script>
import CardDecider from './CardDecider'
import SkillCheck from './SkillCheck'
import { bsg, util } from 'battlestar-common'

export default {
  name: 'SkillCheckPanel',

  components: {
    CardDecider,
    SkillCheck,
  },

  computed: {
    cardsAdded() {
      if (this.check.cardsAdded.length > 0) {
        console.log(this.check.cardsAdded.map(c => this.$game.getCardById(c)))
        return this
          .check
          .cardsAdded
          .map(c => this.$game.getCardById(c))
          .sort((l, r) => {
            if (l.skill !== r.skill) {
              return l.skill.localeCompare(r.skill)
            }
            else {
              return r.value - l.value
            }
          })
      }
      else if (this.check.useInvestigativeCommitee) {
        return this.$game.getZoneByName('crisisPool').cards
      }
      else {
        return []
      }
    },

    check() {
      return this.$game.getSkillCheck()
    },

    currentTotal() {
      const cards = this.cardsAdded
      return bsg.util.calculateCheckValue(cards, this.check)
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
