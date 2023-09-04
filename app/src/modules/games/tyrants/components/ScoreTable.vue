<template>
  <div class="score-table">
    <table class="table table-sm">
      <thead>
        <tr>
          <th></th>
          <th v-for="player in players">
            {{ player.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="key in scoreKeys">
          <td>{{ key }}</td>
          <td v-for="player in players">
            {{ scores[player.name][key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
export default {
  name: 'ScoreTable',

  inject: ['game'],

  computed: {
    players() {
      return this.game.getPlayerAll()
    },

    scores() {
      const output = {}
      for (const player of this.players) {
        output[player.name] = this.game.getScoreBreakdown(player)
      }
      return output
    },

    scoreKeys() {
      const example = Object.values(this.scores)[0]
      return Object.keys(example)
    },

  },
}
</script>
