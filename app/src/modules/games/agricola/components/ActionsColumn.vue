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
    <div class="action-section" v-if="additionalActionIds.length > 0 || linkedPairs.length > 0">
      <div class="section-title">Additional Actions</div>

      <!-- Linked Action Pairs -->
      <div
        v-for="pair in linkedPairs"
        :key="pair[0]"
        class="linked-pair"
      >
        <ActionSpace :actionId="pair[0]" class="linked-action" />
        <div class="link-connector">
          <div class="link-line" />
          <span class="link-icon">🔗</span>
          <div class="link-line" />
        </div>
        <ActionSpace :actionId="pair[1]" class="linked-action" />
      </div>

      <!-- Non-linked Additional Actions -->
      <div class="action-grid" v-if="nonLinkedAdditionalIds.length > 0">
        <ActionSpace
          v-for="actionId in nonLinkedAdditionalIds"
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

// 5-6 player expansion actions (linked spaces)
const FIVE_SIX_PLAYER_ACTION_IDS = [
  'lessons-5',                  // Lessons (linked with Copse)
  'copse-5',                    // Copse: +1 Wood (linked with Lessons)
  'house-building',             // House Building (linked with Traveling Players)
  'traveling-players-5',        // Traveling Players: +1 Food (linked with House Building)
  'lessons-5b',                 // Lessons (linked with Modest Wish)
  'modest-wish-for-children',   // Family Growth with Room (Round 5+)
  'grove-5',                    // Grove: +2 Wood
  'hollow-5',                   // Hollow: +2 Clay
  'resource-market-5',          // Resource Market: 1 Reed + 1 Stone + 1 Food
]

// 6-player only actions
const SIX_PLAYER_ACTION_IDS = [
  'riverbank-forest',   // +1 Wood accumulating + 1 Reed instant
  'grove-6',            // Grove: +2 Wood
  'hollow-6',           // Hollow: +3 Clay
  'resource-market-6',  // 1 Reed + 1 Stone + 1 Wood
  'animal-market',      // Choose sheep or cattle
  'farm-supplies',      // Grain/plow for food
  'building-supplies',  // Food + resource choices
  'corral',             // Get animal you don't have
  'side-job',           // Stable + optional bake
  'improvement-6',      // Minor improvement (Major from Round 5+)
]

// Linked action pairs (first action links to second)
const LINKED_PAIRS = [
  ['lessons-5', 'copse-5'],
  ['house-building', 'traveling-players-5'],
  ['lessons-5b', 'modest-wish-for-children'],
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

    // Get linked pairs where both actions are active
    linkedPairs() {
      return LINKED_PAIRS.filter(pair =>
        this.activeActions.includes(pair[0]) && this.activeActions.includes(pair[1])
      )
    },

    // Get IDs of all actions that are part of an active linked pair
    linkedActionIds() {
      const ids = new Set()
      for (const pair of this.linkedPairs) {
        ids.add(pair[0])
        ids.add(pair[1])
      }
      return ids
    },

    // Additional actions that are NOT part of a linked pair
    nonLinkedAdditionalIds() {
      const allIds = [...new Set([
        ...THREE_PLAYER_ACTION_IDS,
        ...FOUR_PLUS_PLAYER_ACTION_IDS,
        ...FIVE_SIX_PLAYER_ACTION_IDS,
        ...SIX_PLAYER_ACTION_IDS,
      ])]
      return allIds.filter(id =>
        this.activeActions.includes(id) && !this.linkedActionIds.has(id)
      )
    },

    // Legacy: all additional action IDs (for backwards compatibility)
    additionalActionIds() {
      const allIds = [...new Set([
        ...THREE_PLAYER_ACTION_IDS,
        ...FOUR_PLUS_PLAYER_ACTION_IDS,
        ...FIVE_SIX_PLAYER_ACTION_IDS,
        ...SIX_PLAYER_ACTION_IDS,
      ])]
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

/* Linked pair styling */
.linked-pair {
  display: flex;
  align-items: stretch;
  margin-bottom: .5em;
  background-color: #e8eaf6;
  border: 1px solid #9fa8da;
  border-radius: .35em;
  padding: .35em;
}

.linked-pair .linked-action {
  flex: 1;
  min-width: 0;
}

.link-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 .25em;
  min-width: 28px;
}

.link-line {
  flex: 1;
  width: 2px;
  background-color: #7986cb;
  min-height: 4px;
}

.link-icon {
  font-size: .7em;
  padding: .15em 0;
}
</style>
