<template>
  <div class="action-spaces">
    <div class="section-header">
      Action Spaces
      <span class="shield-wall-destroyed" v-if="!game.state.shieldWall">Shield Wall Destroyed</span>
    </div>

    <div class="control-row" v-if="hasControl">
      <span v-for="(owner, loc) in game.state.controlMarkers"
            :key="loc"
            v-show="owner"
            class="control-chip">
        {{ formatName(loc) }}: {{ owner }}
      </span>
    </div>

    <div v-for="group in spaceGroups" :key="group.label" class="space-group">
      <div class="group-label" :class="`group-${group.icon}`">
        <DuneFactionIcon v-if="isFaction(group.icon)"
                         :faction="group.icon"
                         size=".9em"
                         class="group-icon" />
        {{ group.label }}
      </div>
      <div v-for="space in group.spaces" :key="space.id" class="space-row">
        <DuneFactionIcon v-if="isFaction(space.icon)"
                         :faction="space.icon"
                         size=".85em" />
        <span v-else class="space-icon" :class="`icon-${space.icon}`" />
        <span class="space-name">{{ space.name }}</span>
        <span class="space-occupant" v-if="game.state.boardSpaces[space.id]">
          {{ game.state.boardSpaces[space.id] }}
        </span>
        <span class="space-cost" v-if="costLabel(space)">{{ costLabel(space) }}</span>
        <span class="space-combat" v-if="space.isCombatSpace" title="Combat">C</span>
        <span class="space-req" v-if="space.influenceRequirement">
          {{ reqLabel(space.influenceRequirement) }}
        </span>
      </div>
    </div>

    <div class="space-group" v-if="hasBonusSpice">
      <div class="group-label group-yellow">Bonus Spice</div>
      <div v-for="(count, spaceId) in game.state.bonusSpice"
           :key="spaceId"
           v-show="count > 0"
           class="space-row">
        <span class="space-name">{{ formatName(spaceId) }}</span>
        <span class="bonus-amount">+{{ count }}</span>
      </div>
    </div>
  </div>
</template>


<script>
import { dune } from 'battlestar-common'
import DuneFactionIcon from './DuneFactionIcon.vue'

const boardSpaces = dune.res.boardSpaces
const factionIds = new Set(['emperor', 'guild', 'bene-gesserit', 'fremen'])

export default {
  name: 'DuneActionSpaces',

  components: {
    DuneFactionIcon,
  },

  inject: ['game'],

  computed: {
    spaceGroups() {
      const groups = [
        { label: 'City', icon: 'purple', icons: ['purple'] },
        { label: 'Desert', icon: 'yellow', icons: ['yellow'] },
        { label: 'Landsraad', icon: 'green', icons: ['green'] },
        { label: 'Emperor', icon: 'emperor', icons: ['emperor'] },
        { label: 'Spacing Guild', icon: 'guild', icons: ['guild'] },
        { label: 'Bene Gesserit', icon: 'bene-gesserit', icons: ['bene-gesserit'] },
        { label: 'Fremen', icon: 'fremen', icons: ['fremen'] },
      ]

      return groups.map(g => ({
        ...g,
        spaces: boardSpaces.filter(s => g.icons.includes(s.icon)),
      })).filter(g => g.spaces.length > 0)
    },

    hasControl() {
      return Object.values(this.game.state.controlMarkers).some(v => v != null)
    },

    hasBonusSpice() {
      return Object.values(this.game.state.bonusSpice).some(v => v > 0)
    },
  },

  methods: {
    isFaction(icon) {
      return factionIds.has(icon)
    },

    costLabel(space) {
      if (!space.cost) {
        return null
      }
      return Object.entries(space.cost)
        .map(([resource, amount]) => `${amount} ${resource}`)
        .join(', ')
    },

    reqLabel(req) {
      const labels = {
        emperor: 'Emp',
        guild: 'Guild',
        'bene-gesserit': 'BG',
        fremen: 'Fremen',
      }
      return `${labels[req.faction] || req.faction} ${req.amount}+`
    },

    formatName(id) {
      return id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
    },
  },
}
</script>


<style scoped>
.action-spaces {
  padding: .25em;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: .9em;
  color: #8b6914;
  margin-bottom: .3em;
}

.shield-wall-destroyed {
  font-size: .8em;
  color: #c04040;
  font-weight: 400;
}

.control-row {
  display: flex;
  flex-wrap: wrap;
  gap: .3em;
  margin-bottom: .5em;
}

.control-chip {
  font-size: .8em;
  background-color: #f5f0e8;
  border: 1px solid #d4c8a8;
  padding: .1em .4em;
  border-radius: .15em;
}

.space-group {
  margin-bottom: .5em;
}

.group-label {
  font-weight: 600;
  font-size: .8em;
  text-transform: uppercase;
  padding: .15em .4em;
  border-radius: .15em;
  margin-bottom: .15em;
  color: white;
}

.group-icon { color: white; }
.group-purple { background-color: #6a3d8a; }
.group-yellow { background-color: #b8860b; }
.group-green { background-color: #3a7d3a; }
.group-emperor { background-color: #8b2020; }
.group-guild { background-color: #c07020; }
.group-bene-gesserit { background-color: #5b3a8a; }
.group-fremen { background-color: #2a6090; }

.space-row {
  display: flex;
  align-items: center;
  gap: .3em;
  padding: .15em .3em;
  font-size: .85em;
  border-bottom: 1px solid #e8e0d4;
}

.space-row:last-child {
  border-bottom: none;
}

.space-icon {
  display: inline-block;
  width: .7em;
  height: .7em;
}

.icon-purple { background-color: #6a3d8a; border-radius: 50%; }
.icon-yellow { background-color: #b8860b; clip-path: polygon(50% 0%, 100% 100%, 0% 100%); }
.icon-green { background-color: #3a7d3a; clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%); }

.space-name {
  flex: 1;
}

.space-occupant {
  font-weight: 600;
  color: #c04040;
  font-size: .85em;
}

.space-cost {
  color: #8a7a68;
  font-size: .8em;
}

.space-combat {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  line-height: 1.2em;
  text-align: center;
  background-color: #c04040;
  color: white;
  border-radius: .15em;
  font-size: .7em;
  font-weight: bold;
}

.space-req {
  color: #6a5a48;
  font-size: .75em;
  font-style: italic;
}

.bonus-amount {
  color: #b8860b;
  font-weight: bold;
}
</style>
