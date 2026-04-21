<template>
  <div class="dune-data container-fluid">
    <GameHeader />

    <h3 class="mb-3">Dune Imperium: Uprising — Cards</h3>

    <div class="filters mb-3">
      <input
        type="text"
        class="form-control form-control-sm d-inline-block w-auto me-2"
        v-model="search"
        placeholder="Search..."
      />
      <div class="source-filter d-inline-block">
        <button class="btn btn-sm btn-outline-secondary dropdown-toggle"
                @click="sourceDropdownOpen = !sourceDropdownOpen">
          Sources{{ selectedSources.length ? ` (${selectedSources.length})` : '' }}
        </button>
        <div v-if="sourceDropdownOpen" class="source-dropdown">
          <label v-for="s in sources" :key="s" class="source-option">
            <input type="checkbox" :value="s" v-model="selectedSources" /> {{ s }}
          </label>
          <div class="source-actions">
            <a href="#" @click.prevent="selectedSources = []">Clear</a>
          </div>
        </div>
      </div>
    </div>

    <ul class="nav nav-tabs mb-3">
      <li class="nav-item" v-for="tab in tabs" :key="tab.id">
        <a class="nav-link"
           :class="{ active: activeTab === tab.id }"
           @click="activeTab = tab.id">
          {{ tab.name }} ({{ filteredCards(tab.id).length }})
        </a>
      </li>
    </ul>

    <!-- Imperium Cards -->
    <table v-if="activeTab === 'imperium'" class="table table-sm table-striped">
      <thead>
        <tr>
          <th @click="sort('name')" class="sortable">Name</th>
          <th @click="sort('persuasionCost')" class="sortable">Cost</th>
          <th>Faction</th>
          <th>Icons</th>
          <th>Agent Ability</th>
          <th>Reveal</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="card in filteredCards('imperium')" :key="card.name + card.source">
          <td><strong>{{ card.name }}</strong><span v-if="card.count > 1" class="text-muted"> x{{ card.count }}</span></td>
          <td>{{ card.persuasionCost }}</td>
          <td><span v-if="card.factionAffiliation" class="faction-badge" :class="`faction-${card.factionAffiliation}`">{{ card.factionAffiliation }}</span></td>
          <td class="icons-cell">
            <span v-for="icon in card.agentIcons"
                  :key="icon"
                  class="icon"
                  :class="[`icon-${icon}`, `shape-${shapeFor(icon)}`]" />
            <span v-for="f in card.factionAccess"
                  :key="f"
                  class="icon icon-sm"
                  :class="`icon-${f} shape-diamond`" />
          </td>
          <td class="ability-cell">{{ card.agentAbility }}</td>
          <td class="ability-cell">{{ revealText(card) }}</td>
          <td class="text-muted">{{ card.source }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Intrigue Cards -->
    <table v-if="activeTab === 'intrigue'" class="table table-sm table-striped">
      <thead>
        <tr>
          <th @click="sort('name')" class="sortable">Name</th>
          <th>Type</th>
          <th>Plot Effect</th>
          <th>Combat Effect</th>
          <th>Endgame Effect</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="card in filteredCards('intrigue')" :key="card.name + card.source">
          <td><strong>{{ card.name }}</strong></td>
          <td>{{ intrigueType(card) }}</td>
          <td class="ability-cell">{{ card.plotEffect }}</td>
          <td class="ability-cell">{{ card.combatEffect }}</td>
          <td class="ability-cell">{{ card.endgameEffect }}</td>
          <td class="text-muted">{{ card.source }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Conflict Cards -->
    <table v-if="activeTab === 'conflict'" class="table table-sm table-striped">
      <thead>
        <tr>
          <th @click="sort('name')" class="sortable">Name</th>
          <th @click="sort('tier')" class="sortable">Tier</th>
          <th>1st Place</th>
          <th>2nd Place</th>
          <th>3rd Place</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="card in filteredCards('conflict')" :key="card.id">
          <td><strong>{{ card.name }}</strong></td>
          <td>{{ card.tier }}</td>
          <td class="ability-cell">{{ card.rewards.first }}</td>
          <td class="ability-cell">{{ card.rewards.second }}</td>
          <td class="ability-cell">{{ card.rewards.third }}</td>
          <td class="text-muted">{{ card.source }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Leaders -->
    <table v-if="activeTab === 'leaders'" class="table table-sm table-striped">
      <thead>
        <tr>
          <th @click="sort('name')" class="sortable">Name</th>
          <th @click="sort('house')" class="sortable">House</th>
          <th>Leader Ability</th>
          <th>Signet Ring</th>
          <th @click="sort('complexity')" class="sortable">Complexity</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="leader in filteredCards('leaders')" :key="leader.name">
          <td><strong>{{ leader.name }}</strong></td>
          <td>{{ leader.house }}</td>
          <td class="ability-cell">{{ leader.leaderAbility }}</td>
          <td class="ability-cell">{{ leader.signetRingAbility }}</td>
          <td>{{ leader.complexity }}</td>
          <td class="text-muted">{{ leader.source }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Tech Cards -->
    <table v-if="activeTab === 'tech'" class="table table-sm table-striped">
      <thead>
        <tr>
          <th @click="sort('name')" class="sortable">Name</th>
          <th @click="sort('spiceCost')" class="sortable">Cost</th>
          <th>Acquisition Bonus</th>
          <th>Effect</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="card in filteredCards('tech')" :key="card.name">
          <td><strong>{{ card.name }}</strong></td>
          <td>{{ card.spiceCost }}</td>
          <td class="ability-cell">{{ card.acquisitionBonus }}</td>
          <td class="ability-cell">{{ card.effect }}</td>
          <td class="text-muted">{{ card.source }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Contract Cards -->
    <table v-if="activeTab === 'contracts'" class="table table-sm table-striped">
      <thead>
        <tr>
          <th @click="sort('name')" class="sortable">Name</th>
          <th>Reward</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(card, i) in filteredCards('contracts')" :key="card.name + i">
          <td><strong>{{ card.name }}</strong></td>
          <td class="ability-cell">{{ card.reward }}</td>
          <td class="text-muted">{{ card.source }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Tleilax Cards -->
    <table v-if="activeTab === 'tleilax'" class="table table-sm table-striped">
      <thead>
        <tr>
          <th @click="sort('name')" class="sortable">Name</th>
          <th @click="sort('specimenCost')" class="sortable">Cost</th>
          <th>Icons</th>
          <th>Agent Ability</th>
          <th>Reveal</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="card in filteredCards('tleilax')" :key="card.name">
          <td><strong>{{ card.name }}</strong><span v-if="card.count > 1" class="text-muted"> x{{ card.count }}</span></td>
          <td>{{ card.specimenCost }}</td>
          <td class="icons-cell">
            <span v-for="icon in card.agentIcons"
                  :key="icon"
                  class="icon"
                  :class="[`icon-${icon}`, `shape-${shapeFor(icon)}`]" />
          </td>
          <td class="ability-cell">{{ card.agentAbility }}</td>
          <td class="ability-cell">{{ revealText(card) }}</td>
          <td class="text-muted">{{ card.source }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Sardaukar Cards -->
    <table v-if="activeTab === 'sardaukar'" class="table table-sm table-striped">
      <thead>
        <tr>
          <th @click="sort('name')" class="sortable">Name</th>
          <th>Effect</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="card in filteredCards('sardaukar')" :key="card.id">
          <td><strong>{{ card.name }}</strong><span v-if="card.count > 1" class="text-muted"> x{{ card.count }}</span></td>
          <td class="ability-cell">{{ card.effect }}</td>
          <td class="text-muted">{{ card.source }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Reserve Cards -->
    <table v-if="activeTab === 'reserve'" class="table table-sm table-striped">
      <thead>
        <tr>
          <th @click="sort('name')" class="sortable">Name</th>
          <th @click="sort('persuasionCost')" class="sortable">Cost</th>
          <th>Icons</th>
          <th>Acquisition Bonus</th>
          <th>Agent Ability</th>
          <th>Reveal</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="card in filteredCards('reserve')" :key="card.name + card.source">
          <td><strong>{{ card.name }}</strong><span v-if="card.count > 1" class="text-muted"> x{{ card.count }}</span></td>
          <td>{{ card.persuasionCost }}</td>
          <td class="icons-cell">
            <span v-for="icon in card.agentIcons"
                  :key="icon"
                  class="icon"
                  :class="[`icon-${icon}`, `shape-${shapeFor(icon)}`]" />
          </td>
          <td class="ability-cell">{{ card.acquisitionBonus }}</td>
          <td class="ability-cell">{{ card.agentAbility }}</td>
          <td class="ability-cell">{{ revealText(card) }}</td>
          <td class="text-muted">{{ card.source }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Starter Cards -->
    <table v-if="activeTab === 'starter'" class="table table-sm table-striped">
      <thead>
        <tr>
          <th @click="sort('name')" class="sortable">Name</th>
          <th>Count/Player</th>
          <th>Icons</th>
          <th>Agent Ability</th>
          <th>Reveal</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="card in filteredCards('starter')" :key="card.name + card.source">
          <td><strong>{{ card.name }}</strong></td>
          <td>{{ card.countPerPlayer }}</td>
          <td class="icons-cell">
            <span v-for="icon in card.agentIcons"
                  :key="icon"
                  class="icon"
                  :class="[`icon-${icon}`, `shape-${shapeFor(icon)}`]" />
            <span v-for="f in (card.factionAccess || [])"
                  :key="f"
                  class="icon icon-sm"
                  :class="`icon-${f} shape-diamond`" />
          </td>
          <td class="ability-cell">{{ card.agentAbility }}</td>
          <td class="ability-cell">{{ revealText(card) }}</td>
          <td class="text-muted">{{ card.source }}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>


<script>
import { dune } from 'battlestar-common'
import GameHeader from '../../../components/GameHeader.vue'

const cardData = dune.res.cards

export default {
  name: 'DuneCards',

  components: {
    GameHeader,
  },

  data() {
    return {
      activeTab: 'imperium',
      search: '',
      selectedSources: [],
      sourceDropdownOpen: false,
      sortKey: 'name',
      sortAsc: true,
    }
  },

  computed: {
    tabs() {
      return [
        { id: 'imperium', name: 'Imperium' },
        { id: 'intrigue', name: 'Intrigue' },
        { id: 'conflict', name: 'Conflict' },
        { id: 'leaders', name: 'Leaders' },
        { id: 'tech', name: 'Tech' },
        { id: 'contracts', name: 'Contracts' },
        { id: 'tleilax', name: 'Tleilax' },
        { id: 'sardaukar', name: 'Sardaukar' },
        { id: 'reserve', name: 'Reserve' },
        { id: 'starter', name: 'Starter' },
      ]
    },

    sources() {
      const all = [
        ...cardData.imperiumCards,
        ...cardData.intrigueCards,
        ...cardData.conflictCards,
        ...dune.res.leaderData,
        ...cardData.techCards,
        ...cardData.contractCards,
        ...cardData.tleilaxCards,
        ...cardData.sardaukarCards,
        ...cardData.reserveCards,
        ...cardData.starterCards,
      ]
      return [...new Set(all.map(c => c.source))].sort()
    },
  },

  methods: {
    rawCards(tabId) {
      switch (tabId) {
        case 'imperium': return cardData.imperiumCards
        case 'intrigue': return cardData.intrigueCards
        case 'conflict': return cardData.conflictCards
        case 'leaders': return dune.res.leaderData
        case 'tech': return cardData.techCards
        case 'contracts': return cardData.contractCards
        case 'tleilax': return cardData.tleilaxCards
        case 'sardaukar': return cardData.sardaukarCards
        case 'reserve': return cardData.reserveCards
        case 'starter': return cardData.starterCards
        default: return []
      }
    },

    filteredCards(tabId) {
      let cards = this.rawCards(tabId)

      if (this.search) {
        const q = this.search.toLowerCase()
        cards = cards.filter(c => {
          const fields = [
            c.name,
            c.agentAbility,
            c.revealAbility,
            c.plotEffect,
            c.combatEffect,
            c.endgameEffect,
            c.leaderAbility,
            c.signetRingAbility,
            c.effect,
            c.reward,
            c.house,
            c.factionAffiliation,
          ]
          return fields.some(f => f && f.toLowerCase().includes(q))
        })
      }

      if (this.selectedSources.length) {
        cards = cards.filter(c => this.selectedSources.includes(c.source))
      }

      if (this.sortKey) {
        cards = [...cards].sort((a, b) => {
          const av = a[this.sortKey] ?? ''
          const bv = b[this.sortKey] ?? ''
          if (typeof av === 'number' && typeof bv === 'number') {
            return this.sortAsc ? av - bv : bv - av
          }
          const cmp = String(av).localeCompare(String(bv))
          return this.sortAsc ? cmp : -cmp
        })
      }

      return cards
    },

    sort(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc
      }
      else {
        this.sortKey = key
        this.sortAsc = true
      }
    },

    revealText(card) {
      const parts = []
      if (card.revealPersuasion > 0) {
        parts.push(`+${card.revealPersuasion} persuasion`)
      }
      if (card.revealSwords > 0) {
        parts.push(`+${card.revealSwords} sword${card.revealSwords > 1 ? 's' : ''}`)
      }
      if (card.revealAbility) {
        parts.push(card.revealAbility)
      }
      return parts.join(', ') || null
    },

    intrigueType(card) {
      if (card.combatEffect && card.plotEffect) {
        return 'Plot + Combat'
      }
      if (card.combatEffect) {
        return 'Combat'
      }
      if (card.endgameEffect) {
        return 'Endgame'
      }
      return 'Plot'
    },

    shapeFor(icon) {
      if (icon === 'green') {
        return 'pentagon'
      }
      if (icon === 'purple') {
        return 'circle'
      }
      if (icon === 'yellow') {
        return 'triangle'
      }
      return 'diamond'
    },
  },
}
</script>


<style scoped>
.sortable {
  cursor: pointer;
  user-select: none;
}
.sortable:hover {
  text-decoration: underline;
}

.ability-cell {
  font-size: .85em;
  max-width: 300px;
}

.icons-cell {
  white-space: nowrap;
}

/* Icon shapes — matches DuneCard.vue */
.icon {
  display: inline-block;
  vertical-align: middle;
  margin-right: 2px;
}

.shape-circle {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.shape-pentagon {
  width: 15px;
  height: 14px;
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
}

.shape-triangle {
  width: 15px;
  height: 13px;
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}

.shape-diamond {
  width: 16px;
  height: 16px;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.icon-sm.shape-diamond {
  width: 14px;
  height: 14px;
}

/* Icon colors — matches DuneCard.vue */
.icon-green { background-color: #3a7d3a; }
.icon-purple { background-color: #6a3d8a; }
.icon-yellow { background-color: #b8860b; }
.icon-emperor { background-color: #d03030; }
.icon-guild { background-color: #e08828; }
.icon-bene-gesserit { background-color: #8855cc; }
.icon-fremen { background-color: #3088cc; }

/* Faction badges */
.faction-badge {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 3px;
  color: white;
  font-size: .8em;
  font-weight: 500;
  text-transform: capitalize;
}
.faction-emperor { background-color: #d03030; }
.faction-guild { background-color: #e08828; }
.faction-bene-gesserit { background-color: #8855cc; }
.faction-fremen { background-color: #3088cc; }

/* Source multi-select dropdown */
.source-filter {
  position: relative;
}

.source-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: .5em;
  min-width: 160px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.source-option {
  display: block;
  padding: 2px 0;
  cursor: pointer;
  font-size: .9em;
  white-space: nowrap;
}

.source-option input {
  margin-right: .4em;
}

.source-actions {
  border-top: 1px solid #eee;
  margin-top: .3em;
  padding-top: .3em;
  font-size: .85em;
}
</style>
