<template>
  <div class="actions-column-content">
    <!-- Base Actions -->
    <div class="action-section">
      <div class="section-title">Base Actions</div>
      <ActionSpace
        v-for="actionId in baseActionIds"
        :key="actionId"
        :actionId="actionId"
      />
    </div>

    <!-- Additional Actions (3+ players) -->
    <div class="action-section" v-if="additionalActionIds.length > 0">
      <div class="section-title">Additional Actions</div>
      <ActionSpace
        v-for="actionId in additionalActionIds"
        :key="actionId"
        :actionId="actionId"
      />
    </div>

    <!-- Round Cards by Stage -->
    <template v-for="stage in visibleStages" :key="stage">
      <div class="action-section round-cards">
        <div class="section-title">Stage {{ stage }}</div>
        <ActionSpace
          v-for="actionId in stageActionIds(stage)"
          :key="actionId"
          :actionId="actionId"
        />
      </div>
    </template>
  </div>
</template>

<script>
import ActionSpace from './ActionSpace'

// Action IDs grouped by category (hardcoded to match actionSpaces.js)
const BASE_ACTION_IDS = [
  'build-room-stable',
  'starting-player',
  'take-grain',
  'plow-field',
  'occupation',
  'day-laborer',
  'take-wood',
  'take-clay',
  'take-reed',
  'fishing',
]

const THREE_PLAYER_ACTION_IDS = [
  'take-1-building-resource',
  'clay-pit',
  'take-3-wood',
  'resource-market',
]

const FOUR_PLUS_PLAYER_ACTION_IDS = [
  'copse',
  'take-2-wood',
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
      const threePlayer = THREE_PLAYER_ACTION_IDS.filter(id => this.activeActions.includes(id))
      const fourPlus = FOUR_PLUS_PLAYER_ACTION_IDS.filter(id => this.activeActions.includes(id))
      return [...threePlayer, ...fourPlus]
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
      return stageCards.filter(id => this.activeActions.includes(id))
    },
  },
}
</script>

<style scoped>
.actions-column-content {
  padding: .5em;
}

.action-section {
  margin-bottom: 1em;
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
