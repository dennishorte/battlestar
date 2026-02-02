<template>
  <ModalBase id="agricola-game-overview">
    <template #header>Game Overview</template>

    <div class="game-overview">

      <!-- Section A: Stage & Round Table -->
      <div class="section-title">Stages & Rounds</div>
      <table class="stage-table">
        <thead>
          <tr>
            <th>Stage</th>
            <th>Rounds</th>
            <th>New Action Spaces</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="stage in stages"
            :key="stage.number"
            :class="stageRowClass(stage)"
          >
            <td>
              <span class="stage-badge">{{ stage.number }}</span>
            </td>
            <td class="rounds-cell">
              {{ stage.startRound }}<span v-if="stage.startRound !== stage.endRound"> - {{ stage.endRound }}</span>
            </td>
            <td class="cards-cell">
              <span
                v-for="card in stage.cards"
                :key="card.id"
                class="round-card-name"
              >{{ card.name }}</span>
            </td>
            <td class="harvest-cell">
              <span class="harvest-badge">Harvest</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Section B: Round Flow Reference -->
      <div class="section-title">Round Flow</div>
      <ol class="round-flow">
        <li>
          <strong>Replenish</strong>
          <span class="phase-desc">— Accumulating spaces gain resources</span>
        </li>
        <li>
          <strong>New round card</strong>
          <span class="phase-desc">— Reveal next action space</span>
        </li>
        <li>
          <strong>Work phase</strong>
          <span class="phase-desc">— Place family members on action spaces (turns)</span>
        </li>
        <li>
          <strong>Return home</strong>
          <span class="phase-desc">— Workers return</span>
        </li>
        <li>
          <strong>Harvest</strong>
          <span class="phase-desc harvest-note">— Rounds 4, 7, 9, 11, 13, 14</span>
          <ul class="harvest-phases">
            <li><strong>Field phase</strong> — Harvest 1 grain/vegetable from each sown field</li>
            <li><strong>Feeding phase</strong> — Pay 2 food per family member (1 per newborn)</li>
            <li><strong>Breeding</strong> — If 2+ of an animal type, gain 1 offspring</li>
          </ul>
        </li>
      </ol>

    </div>

    <template #footer>
      <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </template>
  </ModalBase>
</template>


<script>
import ModalBase from '@/components/ModalBase.vue'
import { agricola } from 'battlestar-common'

const res = agricola.res

export default {
  name: 'GameOverviewModal',

  components: {
    ModalBase,
  },

  inject: ['game'],

  computed: {
    currentRound() {
      return this.game.state.round
    },

    currentStage() {
      return res.constants.roundToStage[this.currentRound] || 1
    },

    stages() {
      const stagesEndRound = res.constants.stagesEndRound
      const stages = []
      let startRound = 1

      for (let s = 1; s <= 6; s++) {
        const endRound = stagesEndRound[s]
        stages.push({
          number: s,
          startRound,
          endRound,
          cards: res.getRoundCardsByStage(s),
        })
        startRound = endRound + 1
      }

      return stages
    },
  },

  methods: {
    stageRowClass(stage) {
      if (stage.number < this.currentStage) {
        return 'stage-past'
      }
      if (stage.number === this.currentStage) {
        return 'stage-current'
      }
      return ''
    },
  },
}
</script>


<style scoped>
.game-overview {
  font-size: .95em;
}

.section-title {
  font-weight: 700;
  font-size: 1.05em;
  color: #5a3210;
  margin-bottom: .5em;
  margin-top: 1em;
  border-bottom: 1px solid #d2b48c;
  padding-bottom: .25em;
}

.section-title:first-child {
  margin-top: 0;
}

/* Stage Table */
.stage-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: .5em;
}

.stage-table th {
  text-align: left;
  font-size: .85em;
  color: #888;
  padding: .25em .5em;
  border-bottom: 1px solid #d2b48c;
}

.stage-table td {
  padding: .4em .5em;
  vertical-align: top;
  border-bottom: 1px solid #eee;
}

.stage-badge {
  display: inline-block;
  background-color: #8B4513;
  color: white;
  width: 1.6em;
  height: 1.6em;
  line-height: 1.6em;
  text-align: center;
  border-radius: .25em;
  font-weight: 700;
  font-size: .85em;
}

.rounds-cell {
  font-weight: 600;
  white-space: nowrap;
  color: #444;
}

.cards-cell {
  display: flex;
  flex-wrap: wrap;
  gap: .25em;
}

.round-card-name {
  background-color: #f5f0e0;
  border: 1px solid #d2b48c;
  border-radius: .25em;
  padding: .1em .4em;
  font-size: .85em;
  color: #555;
}

.harvest-cell {
  text-align: right;
}

.harvest-badge {
  background-color: #DAA520;
  color: white;
  padding: .15em .4em;
  border-radius: .25em;
  font-size: .8em;
  font-weight: 600;
}

/* Row states */
.stage-past {
  opacity: .5;
}

.stage-current {
  background-color: #e8f5e2;
}

.stage-current .round-card-name {
  border-color: #7ab55c;
}

/* Round Flow */
.round-flow {
  padding-left: 1.5em;
  margin: 0;
}

.round-flow > li {
  margin-bottom: .4em;
}

.phase-desc {
  color: #666;
  font-size: .9em;
}

.harvest-note {
  color: #b8860b;
}

.harvest-phases {
  margin-top: .25em;
  padding-left: 1.2em;
  list-style-type: disc;
  font-size: .9em;
  color: #555;
}

.harvest-phases li {
  margin-bottom: .15em;
}
</style>
