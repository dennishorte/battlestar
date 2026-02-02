<template>
  <div class="major-improvements">
    <div class="section-header" @click="toggleExpand">
      <span class="section-title">Major Improvements</span>
      <span class="section-count">({{ availableCount }}/{{ totalCount }})</span>
      <span class="expand-icon">{{ expanded ? '▼' : '▶' }}</span>
    </div>

    <div class="improvements-grid" v-if="expanded">
      <div
        v-for="imp in improvements"
        :key="imp.id"
        class="improvement-card"
        :class="{ unavailable: imp.unavailable, selectable: isSelectable(imp) }"
        :title="imp.description"
        @click="handleClick(imp)"
      >
        <div class="improvement-header">
          <span class="improvement-name">{{ imp.name }}</span>
          <span class="improvement-vp">{{ imp.victoryPoints }}VP</span>
        </div>
        <div class="improvement-cost">
          <span v-for="(amount, resource) in imp.cost" :key="resource" class="cost-item">
            {{ amount }} {{ resourceIcon(resource) }}
          </span>
          <span
            class="owner-dot"
            v-if="imp.owner"
            :style="{ backgroundColor: imp.ownerColor }"
            :title="imp.owner"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Major improvement definitions (matching majorImprovements.js)
const MAJOR_IMPROVEMENTS = [
  { id: 'fireplace-2', name: 'Fireplace', cost: { clay: 2 }, victoryPoints: 1, description: 'Cook animals/vegetables. Bake: 1 grain → 2 food.' },
  { id: 'fireplace-3', name: 'Fireplace', cost: { clay: 3 }, victoryPoints: 1, description: 'Cook animals/vegetables. Bake: 1 grain → 2 food.' },
  { id: 'cooking-hearth-4', name: 'Cooking Hearth', cost: { clay: 4 }, victoryPoints: 1, description: 'Better cooking rates. Bake: 1 grain → 3 food.' },
  { id: 'cooking-hearth-5', name: 'Cooking Hearth', cost: { clay: 5 }, victoryPoints: 1, description: 'Better cooking rates. Bake: 1 grain → 3 food.' },
  { id: 'clay-oven', name: 'Clay Oven', cost: { clay: 3, stone: 1 }, victoryPoints: 2, description: 'Bake: 1 grain → 5 food (once per action).' },
  { id: 'stone-oven', name: 'Stone Oven', cost: { clay: 1, stone: 3 }, victoryPoints: 3, description: 'Bake: up to 2 grain → 4 food each.' },
  { id: 'joinery', name: 'Joinery', cost: { wood: 2, stone: 2 }, victoryPoints: 2, description: 'Harvest: 1 wood → 2 food. Bonus points for wood.' },
  { id: 'pottery', name: 'Pottery', cost: { clay: 2, stone: 2 }, victoryPoints: 2, description: 'Harvest: 1 clay → 2 food. Bonus points for clay.' },
  { id: 'basketmakers-workshop', name: "Basketmaker's", cost: { reed: 2, stone: 2 }, victoryPoints: 2, description: 'Harvest: 1 reed → 3 food. Bonus points for reed.' },
  { id: 'well', name: 'Well', cost: { wood: 1, stone: 3 }, victoryPoints: 4, description: 'Place 1 food on next 5 round spaces.' },
]

const RESOURCE_ICONS = {
  wood: '🪵',
  clay: '🧱',
  stone: '🪨',
  reed: '🌿',
}

export default {
  name: 'MajorImprovements',

  inject: ['actor', 'bus', 'game', 'ui'],

  data() {
    return {
      expanded: true,
    }
  },

  computed: {
    availableIds() {
      return this.game.state.availableMajorImprovements || []
    },

    improvements() {
      return MAJOR_IMPROVEMENTS.map(imp => {
        const unavailable = !this.availableIds.includes(imp.id)
        let owner = null

        let ownerColor = null

        if (unavailable) {
          // Find who owns it
          for (const player of this.game.players.all()) {
            if (player.majorImprovements && player.majorImprovements.includes(imp.id)) {
              owner = player.name
              ownerColor = player.color
              break
            }
          }
        }

        return { ...imp, unavailable, owner, ownerColor }
      })
    },

    availableCount() {
      return this.improvements.filter(imp => !imp.unavailable).length
    },

    totalCount() {
      return MAJOR_IMPROVEMENTS.length
    },
  },

  methods: {
    toggleExpand() {
      this.expanded = !this.expanded
    },

    resourceIcon(resource) {
      return RESOURCE_ICONS[resource] || resource
    },

    isSelectable(imp) {
      if (imp.unavailable) {
        return false
      }

      // Check if this improvement is in the current player's available choices
      const waiting = this.game.getWaiting(this.game.players.byName(this.actor.name))
      if (!waiting || !waiting.selectors || !waiting.selectors[0]) {
        return false
      }

      const selector = waiting.selectors[0]
      const choices = selector.choices || []

      return choices.some(choice => {
        const choiceStr = (choice.title || choice).toLowerCase()
        return choiceStr.includes(imp.id) || choiceStr.includes(imp.name.toLowerCase())
      })
    },

    selectImprovement(imp) {
      if (this.isSelectable(imp)) {
        this.bus.emit('user-select-option', {
          actor: this.actor,
          optionName: imp.name,
          opts: { prefix: true },
        })
      }
    },

    showCardDetails(imp) {
      if (this.ui?.fn?.showCard) {
        this.ui.fn.showCard(imp.id, 'major')
      }
    },

    handleClick(imp) {
      if (this.isSelectable(imp)) {
        // If selectable, select it
        this.selectImprovement(imp)
      }
      else {
        // Otherwise, show details
        this.showCardDetails(imp)
      }
    },
  },
}
</script>

<style scoped>
.major-improvements {
  margin-bottom: 1em;
}

.section-header {
  display: flex;
  align-items: center;
  gap: .35em;
  padding: .35em .5em;
  background-color: #fce4ec;
  border-radius: .25em;
  cursor: pointer;
  user-select: none;
}

.section-header:hover {
  background-color: #f8bbd9;
}

.section-title {
  font-weight: 600;
  font-size: .9em;
  color: #880e4f;
}

.section-count {
  color: #ad1457;
  font-size: .85em;
}

.expand-icon {
  margin-left: auto;
  font-size: .7em;
  color: #c2185b;
}

.improvements-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: .35em;
  padding: .35em;
}

.improvement-card {
  padding: .35em .5em;
  background-color: #fce4ec;
  border-left: 3px solid #e91e63;
  border-top: 1px solid #f8bbd9;
  border-right: 1px solid #f8bbd9;
  border-bottom: 1px solid #f8bbd9;
  border-radius: .25em;
  font-size: .8em;
  cursor: pointer;
  transition: all 0.15s ease;
}

.improvement-card:hover {
  filter: brightness(0.95);
}

.improvement-card.unavailable {
  background-color: #f5f5f5;
  opacity: 0.6;
}

.improvement-card.selectable {
  cursor: pointer;
  border-color: #4CAF50;
  background-color: #e8f5e9;
}

.improvement-card.selectable:hover {
  background-color: #c8e6c9;
  border-color: #2E7D32;
}

.improvement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .2em;
}

.improvement-name {
  font-weight: 600;
  font-size: .9em;
}

.improvement-vp {
  font-size: .75em;
  color: #1b5e20;
  background-color: #c8e6c9;
  padding: .1em .3em;
  border-radius: .2em;
}

.improvement-cost {
  display: flex;
  gap: .35em;
  font-size: .85em;
}

.cost-item {
  color: #666;
}

.owner-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid #333;
  flex-shrink: 0;
  margin-left: auto;
}
</style>
