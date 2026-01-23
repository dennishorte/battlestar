<template>
  <div class="score-table">
    <table class="table table-sm table-striped">
      <thead>
        <tr>
          <th>Category</th>
          <th v-for="player in players" :key="player.name" class="player-col">
            <span :style="{ color: player.color }">{{ player.name }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Fields</td>
          <td v-for="player in players" :key="player.name">
            {{ getBreakdown(player).fields.count }} ({{ formatPoints(getBreakdown(player).fields.points) }})
          </td>
        </tr>
        <tr>
          <td>Pastures</td>
          <td v-for="player in players" :key="player.name">
            {{ getBreakdown(player).pastures.count }} ({{ formatPoints(getBreakdown(player).pastures.points) }})
          </td>
        </tr>
        <tr>
          <td>Grain</td>
          <td v-for="player in players" :key="player.name">
            {{ getBreakdown(player).grain.count }} ({{ formatPoints(getBreakdown(player).grain.points) }})
          </td>
        </tr>
        <tr>
          <td>Vegetables</td>
          <td v-for="player in players" :key="player.name">
            {{ getBreakdown(player).vegetables.count }} ({{ formatPoints(getBreakdown(player).vegetables.points) }})
          </td>
        </tr>
        <tr>
          <td>Sheep</td>
          <td v-for="player in players" :key="player.name">
            {{ getBreakdown(player).sheep.count }} ({{ formatPoints(getBreakdown(player).sheep.points) }})
          </td>
        </tr>
        <tr>
          <td>Boar</td>
          <td v-for="player in players" :key="player.name">
            {{ getBreakdown(player).boar.count }} ({{ formatPoints(getBreakdown(player).boar.points) }})
          </td>
        </tr>
        <tr>
          <td>Cattle</td>
          <td v-for="player in players" :key="player.name">
            {{ getBreakdown(player).cattle.count }} ({{ formatPoints(getBreakdown(player).cattle.points) }})
          </td>
        </tr>
        <tr>
          <td>Unused Spaces</td>
          <td v-for="player in players" :key="player.name">
            {{ getBreakdown(player).unusedSpaces.count }} ({{ formatPoints(getBreakdown(player).unusedSpaces.points) }})
          </td>
        </tr>
        <tr>
          <td>Fenced Stables</td>
          <td v-for="player in players" :key="player.name">
            {{ getBreakdown(player).fencedStables.count }} (+{{ getBreakdown(player).fencedStables.points }})
          </td>
        </tr>
        <tr>
          <td>Rooms</td>
          <td v-for="player in players" :key="player.name">
            {{ getBreakdown(player).rooms.count }} {{ getBreakdown(player).rooms.type }} (+{{ getBreakdown(player).rooms.points }})
          </td>
        </tr>
        <tr>
          <td>Family Members</td>
          <td v-for="player in players" :key="player.name">
            {{ getBreakdown(player).familyMembers.count }} (+{{ getBreakdown(player).familyMembers.points }})
          </td>
        </tr>
        <tr>
          <td>Card Points</td>
          <td v-for="player in players" :key="player.name">
            +{{ getBreakdown(player).cardPoints }}
          </td>
        </tr>
        <tr>
          <td>Bonus Points</td>
          <td v-for="player in players" :key="player.name">
            +{{ getBreakdown(player).bonusPoints }}
          </td>
        </tr>
        <tr>
          <td>Begging Cards</td>
          <td v-for="player in players" :key="player.name">
            {{ getBreakdown(player).beggingCards.count }} ({{ formatPoints(getBreakdown(player).beggingCards.points) }})
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="total-row">
          <th>Total</th>
          <th v-for="player in players" :key="player.name">
            {{ getBreakdown(player).total }}
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ScoreTable',

  inject: ['game'],

  computed: {
    players() {
      return this.game.players.all()
    },
  },

  methods: {
    getBreakdown(player) {
      return player.getScoreBreakdown()
    },

    formatPoints(points) {
      if (points < 0) {
        return points.toString()
      }
      return '+' + points
    },
  },
}
</script>

<style scoped>
.score-table {
  font-size: .9em;
}

.player-col {
  text-align: center;
  min-width: 80px;
}

.total-row {
  background-color: #f5f5dc;
  font-size: 1.1em;
}

.total-row th {
  text-align: center;
}

.total-row th:first-child {
  text-align: left;
}

tbody td {
  text-align: center;
}

tbody td:first-child {
  text-align: left;
}
</style>
