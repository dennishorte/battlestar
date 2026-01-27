<template>
  <ModalBase id="agricola-score-breakdown" scrollable>
    <template #header>{{ playerName }}'s Score Breakdown</template>

    <div v-if="breakdown" class="score-breakdown">
      <!-- Scoring Matrix Table -->
      <div class="matrix-section">
        <table class="score-matrix">
          <thead>
            <tr>
              <th>Category</th>
              <th class="pts">-1</th>
              <th class="pts">1</th>
              <th class="pts">2</th>
              <th class="pts">3</th>
              <th class="pts">4</th>
              <th class="current">You</th>
              <th class="pts">Pts</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in matrixCategories" :key="cat.key" :class="getRowClass(cat)">
              <td class="category">{{ cat.icon }} {{ cat.label }}</td>
              <td v-for="tier in cat.tiers"
                  :key="tier.label"
                  class="tier"
                  :class="getTierClass(cat, tier)">
                {{ tier.label }}
              </td>
              <td class="current">{{ cat.count }}</td>
              <td class="pts" :class="getPointsClass(cat.points)">{{ formatPoints(cat.points) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Fixed Scoring Section -->
      <div class="fixed-section">
        <div class="section-title">Other Scoring</div>
        <table class="fixed-table">
          <tbody>
            <tr :class="{ negative: breakdown.unusedSpaces.points < 0 }">
              <td class="category">◻ Unused Spaces</td>
              <td class="count">{{ breakdown.unusedSpaces.count }} × -1</td>
              <td class="pts" :class="getPointsClass(breakdown.unusedSpaces.points)">
                {{ formatPoints(breakdown.unusedSpaces.points) }}
              </td>
            </tr>
            <tr>
              <td class="category">⌂ Fenced Stables</td>
              <td class="count">{{ breakdown.fencedStables.count }} × 1</td>
              <td class="pts" :class="getPointsClass(breakdown.fencedStables.points)">
                {{ formatPoints(breakdown.fencedStables.points) }}
              </td>
            </tr>
            <tr>
              <td class="category">🏠 Rooms ({{ breakdown.rooms.type }})</td>
              <td class="count">{{ breakdown.rooms.count }} × {{ roomPointsPerRoom }}</td>
              <td class="pts" :class="getPointsClass(breakdown.rooms.points)">
                {{ formatPoints(breakdown.rooms.points) }}
              </td>
            </tr>
            <tr>
              <td class="category">👤 Family Members</td>
              <td class="count">{{ breakdown.familyMembers.count }} × 3</td>
              <td class="pts" :class="getPointsClass(breakdown.familyMembers.points)">
                {{ formatPoints(breakdown.familyMembers.points) }}
              </td>
            </tr>
            <tr :class="{ negative: breakdown.beggingCards.points < 0 }">
              <td class="category">😢 Begging Cards</td>
              <td class="count">{{ breakdown.beggingCards.count }} × -3</td>
              <td class="pts" :class="getPointsClass(breakdown.beggingCards.points)">
                {{ formatPoints(breakdown.beggingCards.points) }}
              </td>
            </tr>
            <tr v-if="breakdown.cardPoints">
              <td class="category">🃏 Card Points</td>
              <td class="count"/>
              <td class="pts positive">{{ formatPoints(breakdown.cardPoints) }}</td>
            </tr>
            <tr v-if="breakdown.bonusPoints">
              <td class="category">⭐ Bonus Points</td>
              <td class="count"/>
              <td class="pts positive">{{ formatPoints(breakdown.bonusPoints) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Total -->
      <div class="total-section">
        <span class="total-label">Total Score:</span>
        <span class="total-value">{{ breakdown.total }}</span>
      </div>
    </div>
  </ModalBase>
</template>

<script>
import ModalBase from '@/components/ModalBase'

export default {
  name: 'ScoreBreakdownModal',

  components: {
    ModalBase,
  },

  inject: ['game', 'ui'],

  computed: {
    playerName() {
      return this.ui.modals?.scoreBreakdown?.playerName || ''
    },

    player() {
      if (!this.playerName) {
        return null
      }
      return this.game.players.byName(this.playerName)
    },

    breakdown() {
      if (!this.player) {
        return null
      }
      return this.player.getScoreBreakdown()
    },

    roomPointsPerRoom() {
      if (!this.breakdown) {
        return 0
      }
      const type = this.breakdown.rooms.type
      return type === 'stone' ? 2 : type === 'clay' ? 1 : 0
    },

    matrixCategories() {
      if (!this.breakdown) {
        return []
      }

      return [
        {
          key: 'fields',
          label: 'Fields',
          icon: '🌾',
          count: this.breakdown.fields.count,
          points: this.breakdown.fields.points,
          tiers: [
            { label: '0-1', min: 0, max: 1 },
            { label: '2', min: 2, max: 2 },
            { label: '3', min: 3, max: 3 },
            { label: '4', min: 4, max: 4 },
            { label: '5+', min: 5, max: Infinity },
          ],
        },
        {
          key: 'pastures',
          label: 'Pastures',
          icon: '🌿',
          count: this.breakdown.pastures.count,
          points: this.breakdown.pastures.points,
          tiers: [
            { label: '0', min: 0, max: 0 },
            { label: '1', min: 1, max: 1 },
            { label: '2', min: 2, max: 2 },
            { label: '3', min: 3, max: 3 },
            { label: '4+', min: 4, max: Infinity },
          ],
        },
        {
          key: 'grain',
          label: 'Grain',
          icon: '🌾',
          count: this.breakdown.grain.count,
          points: this.breakdown.grain.points,
          tiers: [
            { label: '0', min: 0, max: 0 },
            { label: '1-3', min: 1, max: 3 },
            { label: '4-5', min: 4, max: 5 },
            { label: '6-7', min: 6, max: 7 },
            { label: '8+', min: 8, max: Infinity },
          ],
        },
        {
          key: 'vegetables',
          label: 'Vegetables',
          icon: '🥕',
          count: this.breakdown.vegetables.count,
          points: this.breakdown.vegetables.points,
          tiers: [
            { label: '0', min: 0, max: 0 },
            { label: '1', min: 1, max: 1 },
            { label: '2', min: 2, max: 2 },
            { label: '3', min: 3, max: 3 },
            { label: '4+', min: 4, max: Infinity },
          ],
        },
        {
          key: 'sheep',
          label: 'Sheep',
          icon: '🐑',
          count: this.breakdown.sheep.count,
          points: this.breakdown.sheep.points,
          tiers: [
            { label: '0', min: 0, max: 0 },
            { label: '1-3', min: 1, max: 3 },
            { label: '4-5', min: 4, max: 5 },
            { label: '6-7', min: 6, max: 7 },
            { label: '8+', min: 8, max: Infinity },
          ],
        },
        {
          key: 'boar',
          label: 'Wild Boar',
          icon: '🐗',
          count: this.breakdown.boar.count,
          points: this.breakdown.boar.points,
          tiers: [
            { label: '0', min: 0, max: 0 },
            { label: '1-2', min: 1, max: 2 },
            { label: '3-4', min: 3, max: 4 },
            { label: '5-6', min: 5, max: 6 },
            { label: '7+', min: 7, max: Infinity },
          ],
        },
        {
          key: 'cattle',
          label: 'Cattle',
          icon: '🐄',
          count: this.breakdown.cattle.count,
          points: this.breakdown.cattle.points,
          tiers: [
            { label: '0', min: 0, max: 0 },
            { label: '1', min: 1, max: 1 },
            { label: '2-3', min: 2, max: 3 },
            { label: '4-5', min: 4, max: 5 },
            { label: '6+', min: 6, max: Infinity },
          ],
        },
      ]
    },
  },

  methods: {
    formatPoints(points) {
      if (points > 0) {
        return `+${points}`
      }
      return points.toString()
    },

    getPointsClass(points) {
      if (points < 0) {
        return 'negative'
      }
      if (points > 0) {
        return 'positive'
      }
      return ''
    },

    getRowClass(cat) {
      return {
        negative: cat.points < 0,
        maxed: cat.points === 4,
      }
    },

    getTierClass(cat, tier) {
      const count = cat.count
      const isCurrentTier = count >= tier.min && count <= tier.max
      return {
        current: isCurrentTier,
        below: count < tier.min,
      }
    },
  },
}
</script>

<style scoped>
.score-breakdown {
  padding: .5em;
}

.matrix-section {
  margin-bottom: 1em;
}

.score-matrix {
  width: 100%;
  border-collapse: collapse;
  font-size: .85em;
}

.score-matrix th,
.score-matrix td {
  padding: .35em .5em;
  text-align: center;
  border: 1px solid #ddd;
}

.score-matrix th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.score-matrix .category {
  text-align: left;
  white-space: nowrap;
}

.score-matrix .tier {
  color: #888;
  font-size: .9em;
}

.score-matrix .tier.current {
  background-color: #e3f2fd;
  color: #1976d2;
  font-weight: 600;
}

.score-matrix .tier.below {
  color: #ccc;
}

.score-matrix .current {
  font-weight: 600;
  background-color: #f5f5f5;
}

.score-matrix .pts {
  font-weight: 600;
  min-width: 2.5em;
}

.score-matrix tr.negative {
  background-color: #fff8f8;
}

.score-matrix tr.maxed {
  background-color: #f1f8e9;
}

.positive {
  color: #2e7d32;
}

.negative {
  color: #c62828;
}

.fixed-section {
  margin-bottom: 1em;
}

.section-title {
  font-weight: 600;
  margin-bottom: .5em;
  color: #555;
}

.fixed-table {
  width: 100%;
  border-collapse: collapse;
  font-size: .85em;
}

.fixed-table td {
  padding: .35em .5em;
  border: 1px solid #ddd;
}

.fixed-table .category {
  text-align: left;
}

.fixed-table .count {
  text-align: center;
  color: #666;
  font-size: .9em;
}

.fixed-table .pts {
  text-align: center;
  font-weight: 600;
  min-width: 3em;
}

.fixed-table tr.negative {
  background-color: #fff8f8;
}

.total-section {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: .5em;
  padding: .75em;
  background-color: #e8f5e9;
  border-radius: .25em;
  margin-top: .5em;
}

.total-label {
  font-weight: 600;
  color: #2e7d32;
}

.total-value {
  font-size: 1.5em;
  font-weight: bold;
  color: #1b5e20;
}
</style>
