<template>
  <div class="actions-column-content">
    <!-- Base Actions -->
    <div class="action-section">
      <div class="section-title">Base Actions</div>
      <div class="action-grid">
        <ActionSpace
          v-for="actionId in baseActionIds"
          :key="actionId"
          :actionId="actionId"
        />
      </div>
    </div>

    <!-- Additional Actions (3+ players) -->
    <div class="action-section" v-if="additionalActionIds.length > 0">
      <div class="section-title">Additional Actions</div>
      <div class="action-grid">
        <ActionSpace
          v-for="actionId in additionalActionIds"
          :key="actionId"
          :actionId="actionId"
        />
      </div>
    </div>

    <!-- Round Cards by Stage -->
    <template v-for="stage in visibleStages" :key="stage">
      <div class="action-section round-cards">
        <div class="section-title">Stage {{ stage }}</div>
        <div class="action-grid">
          <ActionSpace
            v-for="actionId in stageActionIds(stage)"
            :key="actionId"
            :actionId="actionId"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import ActionSpace from './ActionSpace.vue'

// Action IDs grouped by category (hardcoded to match actionSpaces.js)
// Revised Edition names
const BASE_ACTION_IDS = [
  'build-room-stable',  // Farm Expansion
  'starting-player',    // Meeting Place
  'take-grain',         // Grain Seeds
  'plow-field',         // Farmland
  'occupation',         // Lessons
  'day-laborer',        // Day Laborer
  'take-wood',          // Forest
  'take-clay',          // Clay Pit
  'take-reed',          // Reed Bank
  'fishing',            // Fishing
]

// 3-player additional actions (Revised Edition)
const THREE_PLAYER_ACTION_IDS = [
  'grove',              // Grove: +2 Wood accumulating
  'hollow',             // Hollow: +1 Clay accumulating
  'resource-market',    // Resource Market: 1 Food + choice of Reed/Stone
  'lessons-3',          // Lessons: occupation cost 2 food
]

// 4+ player actions (Revised Edition - replaces 3-player actions, not cumulative)
const FOUR_PLUS_PLAYER_ACTION_IDS = [
  'copse',              // Copse: +1 Wood accumulating
  'grove',              // Grove: +2 Wood accumulating
  'hollow',             // Hollow: +2 Clay accumulating
  'resource-market',    // Resource Market: 1 Reed + 1 Stone + 1 Food
  'lessons-4',          // Lessons: occupation cost varies
  'traveling-players',  // Traveling Players: +1 Food accumulating
]

const ROUND_CARDS_BY_STAGE = {
  1: ['sow-bake', 'take-sheep', 'fencing', 'major-minor-improvement'],
  2: ['family-growth-minor', 'take-stone-1', 'renovation-improvement'],
  3: ['take-vegetable', 'take-boar'],
  4: ['take-cattle', 'take-stone-2'],
  5: ['family-growth-urgent', 'plow-sow'],
  6: ['renovation-fencing'],
}

export default {
  name: 'ActionsColumn',

  components: {
    ActionSpace,
  },

  inject: ['game'],

  computed: {
    activeActions() {
      return this.game.state.activeActions || []
    },

    baseActionIds() {
      return BASE_ACTION_IDS.filter(id => this.activeActions.includes(id))
    },

    additionalActionIds() {
      const allIds = [...new Set([...THREE_PLAYER_ACTION_IDS, ...FOUR_PLUS_PLAYER_ACTION_IDS])]
      return allIds.filter(id => this.activeActions.includes(id))
    },

    visibleStages() {
      // Show stages that have at least one revealed card
      const stages = []
      for (let stage = 1; stage <= 6; stage++) {
        const stageCards = ROUND_CARDS_BY_STAGE[stage] || []
        if (stageCards.some(id => this.activeActions.includes(id))) {
          stages.push(stage)
        }
      }
      return stages
    },
  },

  methods: {
    stageActionIds(stage) {
      const stageCards = ROUND_CARDS_BY_STAGE[stage] || []
      // Filter to only active cards, then sort by their position in activeActions
      // (which reflects the order they were revealed)
      return stageCards
        .filter(id => this.activeActions.includes(id))
        .sort((a, b) => this.activeActions.indexOf(a) - this.activeActions.indexOf(b))
    },
  },
}
</script>

<style scoped>
.actions-column-content {
  padding: .5em;
}

.action-section {
  margin-bottom: .75em;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .35em;
}

.section-title {
  font-weight: bold;
  font-size: .9em;
  color: #555;
  border-bottom: 2px solid #8B4513;
  padding-bottom: .25em;
  margin-bottom: .5em;
}

.round-cards .section-title {
  background-color: #f5f5dc;
  padding: .25em .5em;
  border-radius: .25em;
  border-bottom: none;
}
</style>
