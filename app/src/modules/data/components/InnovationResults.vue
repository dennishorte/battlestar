<template>
  <div class="row innovation-win-data">
    <div class="col">
      <h4>Win Conditions</h4>
      <div v-for="(result, index) in winConditions" :key="index">
        {{ result[1] }} {{ result[0] }}
      </div>
    </div>

    <div class="col">
      <h4>Player Stats</h4>

      <div class="player-stats" v-for="[player, stats] in playerData" :key="player">
        <button class="btn" data-bs-toggle="collapse" :data-bs-target="`#stats-${player}`">
          {{ player }}
        </button>
        <div class="collapse" :id="`stats-${player}`">
          <div class="card card-body">
            <h5>Win Conditions</h5>
            <div v-for="[cond, count] in Object.entries(stats.conditions)" :key="cond">
              {{ count }} {{ cond }}
            </div>

            <h5>Win Ratios</h5>
            <div v-for="[opp, { wins, loss }] in Object.entries(stats.vs)" :key="opp">
              {{ wins }}/{{ wins + loss }} {{ opp }}
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>


<script>
import axios from 'axios'

import { util } from 'battlestar-common'

export default {
  name: 'InnovationWinData',

  data() {
    return {
      gameDataRaw: []
    }
  },

  computed: {
    stats() {
      const winConditions = {}
      const winners = {}

      for (const datum of this.gameDataRaw) {
        if (
          !datum.stats
          || datum.stats.error
          || !datum.stats.gameOver
        ) continue

        const winner = datum.stats.result.player.name
        const reason = datum.stats.result.reason

        // Tabulate win conditions
        util.ensure(winConditions, reason, 0)
        winConditions[reason] += 1

        // Tabulate player win/loss records
        for (const player of datum.settings.players) {
          const win = player.name === winner

          util.ensure(winners, player.name, {
            vs: {},
            conditions: {}
          })
          const { vs, conditions } = winners[player.name]

          // Tabulate this player's win conditions
          if (win) {
            util.ensure(conditions, reason, 0)
            conditions[reason] += 1
          }

          // Tabulate this player's win/loss record against others.
          if (datum.settings.players.length === 1) {
            continue
          }
          else if (datum.settings.players.length > 2) {
            const key = `${datum.settings.players.length}-player`
            util.ensure(vs, key, {
              wins: 0,
              loss: 0,
            })
            if (win) {
              vs[key].wins += 1
            }
            else {
              vs[key].loss += 1
            }
          }
          else {
            for (const other of datum.settings.players) {
              if (other === player) continue

              util.ensure(vs, other.name, {
                wins: 0,
                loss: 0,
              })

              if (win) {
                vs[other.name].wins += 1
              }
              else {
                vs[other.name].loss += 1
              }
            }
          }
        }
      }

      return {
        conditions: winConditions,
        players: winners,
      }
    },

    playerData() {
      return Object
        .entries(this.stats.players)
        .sort((l, r) => l[0].localeCompare(r[0]))
    },

    winConditions() {
      return Object
        .entries(this.stats.conditions)
        .sort((l, r) => {
          if (r[1] === l[1]) {
            return l[0].localeCompare(r[0])
          }
          else {
            return r[1] - l[1]
          }
        })
    },
  },

  async created() {
    const requestResult = await axios.post('/api/game/stats/innovation')
    this.data = requestResult.data.data
  },
}
</script>


<style scoped>
</style>
