<template>
  <div class="twilight-data container">
    <GameHeader />

    <h3 class="mb-3">Twilight Imperium Data</h3>

    <div class="filters mb-3">
      <input
        type="text"
        class="form-control form-control-sm d-inline-block w-auto me-2"
        v-model="search"
        placeholder="Search by name..."
      />
      <select
        v-if="filterOptions.length > 0"
        v-model="selectedFilter"
        class="form-select form-select-sm d-inline-block w-auto"
      >
        <option value="">All</option>
        <option v-for="opt in filterOptions" :key="opt.id" :value="opt.id">
          {{ opt.name }}
        </option>
      </select>
    </div>

    <ul class="nav nav-tabs mb-3">
      <li class="nav-item" v-for="tab in tabs" :key="tab.id">
        <a
          class="nav-link"
          :class="{ active: activeTab === tab.id }"
          @click="switchTab(tab.id)"
        >
          {{ tab.name }} ({{ tabCount(tab.id) }})
        </a>
      </li>
    </ul>

    <div class="row">
      <div class="col">

        <!-- Factions -->
        <table v-if="activeTab === 'factions'" class="table table-sm table-striped">
          <thead>
            <tr>
              <th @click="sort('name')" class="sortable">Name</th>
              <th @click="sort('commodities')" class="sortable">Comm.</th>
              <th>Starting Tech</th>
              <th>Abilities</th>
              <th>Flagship</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="faction in filteredFactions" :key="faction.id">
              <tr class="clickable" @click="toggleExpand(faction.id)">
                <td><strong>{{ faction.name }}</strong></td>
                <td>{{ faction.commodities }}</td>
                <td>{{ faction.startingTechnologies.map(techName).join(', ') }}</td>
                <td>{{ faction.abilities.map(a => a.name).join(', ') }}</td>
                <td>{{ faction.flagship.name }}</td>
              </tr>
              <tr v-if="expandedId === faction.id">
                <td colspan="5" class="expanded-detail">
                  <div class="row">
                    <div class="col-md-6">
                      <p class="text-muted small mb-1">{{ faction.lore }}</p>
                      <h6>Abilities</h6>
                      <ul class="small">
                        <li v-for="a in faction.abilities" :key="a.id">
                          <strong>{{ a.name }}:</strong> {{ a.description }}
                        </li>
                      </ul>
                      <h6>Leaders</h6>
                      <ul class="small">
                        <li><strong>Agent:</strong> {{ faction.leaders.agent.name }} — {{ faction.leaders.agent.description }}</li>
                        <li><strong>Commander:</strong> {{ faction.leaders.commander.name }} — {{ faction.leaders.commander.description }} <em>(Unlock: {{ faction.leaders.commander.unlockCondition }})</em></li>
                        <li><strong>Hero:</strong> {{ faction.leaders.hero.name }} — {{ faction.leaders.hero.description }}</li>
                      </ul>
                    </div>
                    <div class="col-md-6">
                      <h6>Flagship: {{ faction.flagship.name }}</h6>
                      <p class="small">
                        Cost {{ faction.flagship.cost }} | Combat {{ faction.flagship.combat }} | Move {{ faction.flagship.move }} | Capacity {{ faction.flagship.capacity }}
                        <br/>{{ faction.flagship.description }}
                      </p>
                      <h6>Mech: {{ faction.mech.name }}</h6>
                      <p class="small">
                        Cost {{ faction.mech.cost }} | Combat {{ faction.mech.combat }}
                        <br/>{{ faction.mech.description }}
                      </p>
                      <h6>Promissory Note: {{ faction.promissoryNote.name }}</h6>
                      <p class="small">{{ faction.promissoryNote.description }}</p>
                      <h6>Faction Technologies</h6>
                      <ul class="small">
                        <li v-for="tech in faction.factionTechnologies" :key="tech.id">
                          <strong>{{ tech.name }}</strong>
                          ({{ formatPrereqs(tech.prerequisites) }})
                          — {{ tech.description || formatUnitUpgrade(tech) }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <!-- Technologies -->
        <table v-if="activeTab === 'technologies'" class="table table-sm table-striped">
          <thead>
            <tr>
              <th @click="sort('name')" class="sortable">Name</th>
              <th @click="sort('color')" class="sortable">Color</th>
              <th>Prerequisites</th>
              <th>Faction</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tech in filteredTechnologies" :key="tech.id">
              <td>{{ tech.name }}</td>
              <td>
                <span class="badge" :class="techBadgeClass(tech.color)">
                  {{ tech.color || 'faction' }}
                </span>
              </td>
              <td>{{ formatPrereqs(tech.prerequisites) }}</td>
              <td>{{ tech.factionName || '' }}</td>
              <td class="small">{{ tech.description || '' }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Action Cards -->
        <table v-if="activeTab === 'actionCards'" class="table table-sm table-striped">
          <thead>
            <tr>
              <th @click="sort('name')" class="sortable">Name</th>
              <th @click="sort('timing')" class="sortable">Timing</th>
              <th @click="sort('count')" class="sortable">Count</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="card in filteredActionCards" :key="card.id">
              <td>{{ card.name }}</td>
              <td>{{ formatTiming(card.timing) }}</td>
              <td>{{ card.count }}</td>
              <td class="small">{{ card.effect }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Objectives -->
        <table v-if="activeTab === 'objectives'" class="table table-sm table-striped">
          <thead>
            <tr>
              <th @click="sort('name')" class="sortable">Name</th>
              <th @click="sort('stage')" class="sortable">Stage</th>
              <th @click="sort('points')" class="sortable">Points</th>
              <th @click="sort('type')" class="sortable">Type</th>
              <th>Condition</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="obj in filteredObjectives" :key="obj.id">
              <td>{{ obj.name }}</td>
              <td>{{ obj.stage === 'secret' ? '—' : obj.stage }}</td>
              <td>{{ obj.points }}</td>
              <td>{{ obj.type }}</td>
              <td class="small">{{ obj.condition }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Agenda Cards -->
        <table v-if="activeTab === 'agendaCards'" class="table table-sm table-striped">
          <thead>
            <tr>
              <th @click="sort('name')" class="sortable">Name</th>
              <th @click="sort('type')" class="sortable">Type</th>
              <th @click="sort('outcomeType')" class="sortable">Outcome</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="card in filteredAgendaCards" :key="card.id">
              <td>{{ card.name }}</td>
              <td>{{ card.type }}</td>
              <td>{{ formatTiming(card.outcomeType) }}</td>
              <td class="small">{{ card.description }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Exploration Cards -->
        <table v-if="activeTab === 'exploration'" class="table table-sm table-striped">
          <thead>
            <tr>
              <th @click="sort('name')" class="sortable">Name</th>
              <th @click="sort('trait')" class="sortable">Trait</th>
              <th @click="sort('type')" class="sortable">Type</th>
              <th @click="sort('count')" class="sortable">Count</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="card in filteredExploration" :key="card.id">
              <td>{{ card.name }}</td>
              <td>{{ card.trait }}</td>
              <td>{{ card.type }}</td>
              <td>{{ card.count }}</td>
              <td class="small">{{ card.effect }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Relics -->
        <table v-if="activeTab === 'relics'" class="table table-sm table-striped">
          <thead>
            <tr>
              <th @click="sort('name')" class="sortable">Name</th>
              <th @click="sort('type')" class="sortable">Type</th>
              <th @click="sort('expansion')" class="sortable">Expansion</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="relic in filteredRelics" :key="relic.id">
              <td>{{ relic.name }}</td>
              <td>{{ relic.type }}</td>
              <td>{{ relic.expansion }}</td>
              <td class="small">{{ relic.effect }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Promissory Notes -->
        <table v-if="activeTab === 'promissory'" class="table table-sm table-striped">
          <thead>
            <tr>
              <th @click="sort('name')" class="sortable">Name</th>
              <th @click="sort('faction')" class="sortable">Faction</th>
              <th @click="sort('timing')" class="sortable">Timing</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="note in filteredPromissory" :key="note.id">
              <td>{{ note.name }}</td>
              <td>{{ note.faction || 'Generic' }}</td>
              <td>{{ formatTiming(note.timing) }}</td>
              <td class="small">{{ note.description }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Strategy Cards -->
        <table v-if="activeTab === 'strategy'" class="table table-sm table-striped">
          <thead>
            <tr>
              <th @click="sort('number')" class="sortable">#</th>
              <th @click="sort('name')" class="sortable">Name</th>
              <th>Primary</th>
              <th>Secondary</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="card in filteredStrategy" :key="card.id">
              <td>{{ card.number }}</td>
              <td>{{ card.name }}</td>
              <td class="small">{{ card.primary.join(' ') }}</td>
              <td class="small">{{ card.secondary.join(' ') }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Units -->
        <table v-if="activeTab === 'units'" class="table table-sm table-striped">
          <thead>
            <tr>
              <th @click="sort('name')" class="sortable">Name</th>
              <th @click="sort('category')" class="sortable">Category</th>
              <th @click="sort('cost')" class="sortable">Cost</th>
              <th @click="sort('combat')" class="sortable">Combat</th>
              <th @click="sort('move')" class="sortable">Move</th>
              <th @click="sort('capacity')" class="sortable">Capacity</th>
              <th>Abilities</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="unit in filteredUnits" :key="unit.type">
              <td>{{ unit.name }}</td>
              <td>{{ unit.category }}</td>
              <td>{{ unit.cost || '—' }}</td>
              <td>{{ unit.combat || '—' }}</td>
              <td>{{ unit.move || '—' }}</td>
              <td>{{ unit.capacity || '—' }}</td>
              <td class="small">{{ (unit.abilities || []).join(', ') }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Planets -->
        <table v-if="activeTab === 'planets'" class="table table-sm table-striped">
          <thead>
            <tr>
              <th @click="sort('name')" class="sortable">Name</th>
              <th @click="sort('resources')" class="sortable">Resources</th>
              <th @click="sort('influence')" class="sortable">Influence</th>
              <th @click="sort('trait')" class="sortable">Trait</th>
              <th @click="sort('techSpecialty')" class="sortable">Tech</th>
              <th @click="sort('legendary')" class="sortable">Legendary</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="planet in filteredPlanets" :key="planet.id">
              <td>{{ planet.name }}</td>
              <td>{{ planet.resources }}</td>
              <td>{{ planet.influence }}</td>
              <td>{{ planet.trait || '—' }}</td>
              <td>
                <span v-if="planet.techSpecialty" class="badge" :class="techBadgeClass(planet.techSpecialty)">
                  {{ planet.techSpecialty }}
                </span>
                <span v-else>—</span>
              </td>
              <td>{{ planet.legendary ? 'Yes' : '' }}</td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </div>
</template>


<script>
import GameHeader from '@/components/GameHeader.vue'
import { twilight } from 'battlestar-common'

const res = twilight.res

export default {
  name: 'TwilightData',

  components: {
    GameHeader,
  },

  data() {
    return {
      activeTab: 'factions',
      search: '',
      selectedFilter: '',
      sortField: 'name',
      sortDir: 1,
      expandedId: null,

      factions: [],
      technologies: [],
      actionCards: [],
      objectives: [],
      agendaCards: [],
      exploration: [],
      relics: [],
      promissory: [],
      strategy: [],
      units: [],
      planets: [],
    }
  },

  computed: {
    tabs() {
      return [
        { id: 'factions', name: 'Factions' },
        { id: 'technologies', name: 'Technologies' },
        { id: 'actionCards', name: 'Action Cards' },
        { id: 'objectives', name: 'Objectives' },
        { id: 'agendaCards', name: 'Agenda Cards' },
        { id: 'exploration', name: 'Exploration' },
        { id: 'relics', name: 'Relics' },
        { id: 'promissory', name: 'Promissory Notes' },
        { id: 'strategy', name: 'Strategy' },
        { id: 'units', name: 'Units' },
        { id: 'planets', name: 'Planets' },
      ]
    },

    searchLower() {
      return this.search.toLowerCase()
    },

    filterOptions() {
      const tab = this.activeTab
      if (tab === 'technologies') {
        return [
          { id: 'blue', name: 'Blue (Propulsion)' },
          { id: 'red', name: 'Red (Warfare)' },
          { id: 'yellow', name: 'Yellow (Cybernetic)' },
          { id: 'green', name: 'Green (Biotic)' },
          { id: 'unit-upgrade', name: 'Unit Upgrades' },
          { id: 'faction', name: 'Faction' },
        ]
      }
      if (tab === 'objectives') {
        return [
          { id: 'stage1', name: 'Stage I' },
          { id: 'stage2', name: 'Stage II' },
          { id: 'secret', name: 'Secret' },
        ]
      }
      if (tab === 'agendaCards') {
        return [
          { id: 'law', name: 'Laws' },
          { id: 'directive', name: 'Directives' },
        ]
      }
      if (tab === 'exploration') {
        return [
          { id: 'cultural', name: 'Cultural' },
          { id: 'hazardous', name: 'Hazardous' },
          { id: 'industrial', name: 'Industrial' },
          { id: 'frontier', name: 'Frontier' },
        ]
      }
      if (tab === 'actionCards') {
        const timings = [...new Set(this.actionCards.map(c => c.timing))]
        return timings.sort().map(t => ({ id: t, name: this.formatTiming(t) }))
      }
      if (tab === 'planets') {
        return [
          { id: 'cultural', name: 'Cultural' },
          { id: 'hazardous', name: 'Hazardous' },
          { id: 'industrial', name: 'Industrial' },
          { id: 'none', name: 'No Trait' },
        ]
      }
      if (tab === 'units') {
        return [
          { id: 'ship', name: 'Ships' },
          { id: 'ground', name: 'Ground Forces' },
          { id: 'structure', name: 'Structures' },
        ]
      }
      return []
    },

    filteredFactions() {
      return this.sortItems(this.searchFilter(this.factions))
    },
    filteredTechnologies() {
      let items = this.searchFilter(this.technologies)
      if (this.selectedFilter) {
        if (this.selectedFilter === 'faction') {
          items = items.filter(t => t.factionName)
        }
        else {
          items = items.filter(t => t.color === this.selectedFilter)
        }
      }
      return this.sortItems(items)
    },
    filteredActionCards() {
      let items = this.searchFilter(this.actionCards)
      if (this.selectedFilter) {
        items = items.filter(c => c.timing === this.selectedFilter)
      }
      return this.sortItems(items)
    },
    filteredObjectives() {
      let items = this.searchFilter(this.objectives)
      if (this.selectedFilter === 'stage1') {
        items = items.filter(o => o.stage === 1)
      }
      else if (this.selectedFilter === 'stage2') {
        items = items.filter(o => o.stage === 2)
      }
      else if (this.selectedFilter === 'secret') {
        items = items.filter(o => o.type === 'secret')
      }
      return this.sortItems(items)
    },
    filteredAgendaCards() {
      let items = this.searchFilter(this.agendaCards)
      if (this.selectedFilter) {
        items = items.filter(c => c.type === this.selectedFilter)
      }
      return this.sortItems(items)
    },
    filteredExploration() {
      let items = this.searchFilter(this.exploration)
      if (this.selectedFilter) {
        items = items.filter(c => c.trait === this.selectedFilter)
      }
      return this.sortItems(items)
    },
    filteredRelics() {
      return this.sortItems(this.searchFilter(this.relics))
    },
    filteredPromissory() {
      let items = this.searchFilter(this.promissory)
      if (this.selectedFilter) {
        // No filter options defined, but could filter by generic/faction
      }
      return this.sortItems(items)
    },
    filteredStrategy() {
      return this.sortItems(this.searchFilter(this.strategy))
    },
    filteredUnits() {
      let items = this.searchFilter(this.units)
      if (this.selectedFilter) {
        items = items.filter(u => u.category === this.selectedFilter)
      }
      return this.sortItems(items)
    },
    filteredPlanets() {
      let items = this.searchFilter(this.planets)
      if (this.selectedFilter === 'none') {
        items = items.filter(p => !p.trait)
      }
      else if (this.selectedFilter) {
        items = items.filter(p => p.trait === this.selectedFilter)
      }
      return this.sortItems(items)
    },
  },

  methods: {
    switchTab(tab) {
      this.activeTab = tab
      this.selectedFilter = ''
      this.sortField = 'name'
      this.sortDir = 1
      this.expandedId = null
    },

    tabCount(tabId) {
      return this[tabId]?.length || 0
    },

    toggleExpand(id) {
      this.expandedId = this.expandedId === id ? null : id
    },

    sort(field) {
      if (this.sortField === field) {
        this.sortDir *= -1
      }
      else {
        this.sortField = field
        this.sortDir = 1
      }
    },

    searchFilter(items) {
      if (!this.searchLower) {
        return items
      }
      return items.filter(item => {
        const name = (item.name || '').toLowerCase()
        const desc = (item.description || item.effect || item.condition || '').toLowerCase()
        return name.includes(this.searchLower) || desc.includes(this.searchLower)
      })
    },

    sortItems(items) {
      const sorted = [...items]
      const { sortField, sortDir } = this
      sorted.sort((a, b) => {
        const aVal = a[sortField] ?? ''
        const bVal = b[sortField] ?? ''
        if (typeof aVal === 'string') {
          return sortDir * aVal.localeCompare(bVal)
        }
        return sortDir * (aVal - bVal)
      })
      return sorted
    },

    techName(id) {
      const tech = res.getTechnology(id)
      return tech ? tech.name : id
    },

    formatPrereqs(prereqs) {
      if (!prereqs || prereqs.length === 0) {
        return '—'
      }
      return prereqs.join(', ')
    },

    formatTiming(timing) {
      if (!timing) {
        return ''
      }
      return timing.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    },

    formatUnitUpgrade(tech) {
      if (!tech.stats) {
        return ''
      }
      return Object.entries(tech.stats)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
        .join(', ')
    },

    techBadgeClass(color) {
      const map = {
        blue: 'bg-primary',
        red: 'bg-danger',
        yellow: 'bg-warning text-dark',
        green: 'bg-success',
        'unit-upgrade': 'bg-secondary',
      }
      return map[color] || 'bg-dark'
    },

    loadData() {
      this.factions = res.getAllFactions()

      // Generic + faction technologies
      const genericTechs = res.getAllTechnologies().map(t => ({ ...t, factionName: null }))
      const factionTechs = []
      for (const faction of this.factions) {
        for (const tech of (faction.factionTechnologies || [])) {
          factionTechs.push({ ...tech, factionName: faction.name })
        }
      }
      this.technologies = [...genericTechs, ...factionTechs]

      this.actionCards = res.getAllActionCards()

      this.objectives = [
        ...res.getPublicObjectivesI(),
        ...res.getPublicObjectivesII(),
        ...res.getSecretObjectives(),
      ]

      this.agendaCards = res.getAllAgendaCards()

      // Exploration: deduplicate cards with copies
      const allExploration = res.getAllExplorationCards()
      const explorationMap = new Map()
      for (const card of allExploration) {
        const baseId = card.id.replace(/-\d+$/, '')
        if (explorationMap.has(baseId)) {
          explorationMap.get(baseId).count++
        }
        else {
          explorationMap.set(baseId, { ...card, id: baseId, count: 1 })
        }
      }
      this.exploration = [...explorationMap.values()]

      this.relics = res.getAllRelics()

      // Promissory: generic + faction
      const generic = res.getGenericPromissoryNotes().map(n => ({ ...n, faction: null }))
      const factionNotes = this.factions
        .filter(f => f.promissoryNote)
        .map(f => ({ ...f.promissoryNote, faction: f.name }))
      this.promissory = [...generic, ...factionNotes]

      this.strategy = res.getAllStrategyCards()
      this.units = res.getAllUnits()
      this.planets = res.getAllPlanets()
    },
  },

  created() {
    this.loadData()
  },
}
</script>


<style scoped>
.sortable {
  cursor: pointer;
}

.sortable:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-link {
  cursor: pointer;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

.expanded-detail {
  background-color: rgba(0, 0, 0, 0.02);
  padding: 1rem;
}

.badge {
  font-size: 0.75rem;
}
</style>
