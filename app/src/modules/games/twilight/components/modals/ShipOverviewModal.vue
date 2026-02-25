<template>
  <ModalBase id="twilight-ship-overview">
    <template #header>Unit Reference</template>

    <div class="ship-overview">
      <div v-for="section in unitSections" :key="section.type" class="unit-section">

        <!-- Unit base stats -->
        <div class="unit-header">
          <span class="unit-name">{{ section.base.name }}</span>
        </div>
        <div class="unit-row base-row">
          <span class="stat-chips">
            <span class="stat-chip">Cost {{ formatCost(section.base) }}</span>
            <span class="stat-chip" v-if="section.base.combat">Cbt {{ section.base.combat }}</span>
            <span class="stat-chip" v-if="section.base.move">Move {{ section.base.move }}</span>
            <span class="stat-chip" v-if="section.base.capacity">Cap {{ section.base.capacity }}</span>
            <span class="stat-chip" v-if="section.base.hits > 1">Hits {{ section.base.hits }}</span>
          </span>
          <div class="row-abilities" v-if="section.base.abilities?.length">
            {{ formatAbilities(section.base.abilities) }}
          </div>
        </div>

        <!-- Generic upgrade -->
        <div v-if="section.genericUpgrade"
             class="unit-row upgrade-row"
             :class="{ inactive: section.genericUpgrade.owners.length === 0 }">
          <div class="upgrade-header">
            <span class="row-label">{{ section.genericUpgrade.name }}</span>
            <span class="player-pips">
              <span v-for="p in section.genericUpgrade.owners"
                    :key="p.name"
                    class="player-pip"
                    :style="{ background: p.color }"
                    :title="p.name" />
            </span>
          </div>
          <span class="stat-chips" v-if="section.genericUpgrade.diffKeys.length">
            <span v-for="key in section.genericUpgrade.diffKeys" :key="key" class="stat-chip changed">
              {{ formatStatLabel(key) }} {{ formatStatValue(key, section.genericUpgrade.stats[key]) }}
            </span>
          </span>
          <div class="row-description" v-if="section.genericUpgrade.description">
            {{ section.genericUpgrade.description }}
          </div>
        </div>

        <!-- Faction variants (unitOverrides + faction techs, in-game only) -->
        <div v-for="variant in section.factionVariants"
             :key="variant.factionId + variant.source"
             class="unit-row variant-row"
             :class="{ inactive: variant.source === 'tech' && !variant.active }">
          <div class="variant-header">
            <span class="player-pip" :style="{ background: variant.playerColor }" />
            <span class="faction-name">{{ variant.factionName }}</span>
            <span class="source-badge" :class="variant.source">{{ variant.source === 'base' ? 'unique' : 'tech' }}</span>
            <span class="variant-unit-name">{{ variant.unitName }}</span>
            <span v-if="variant.source === 'tech'"
                  class="tech-status"
                  :class="variant.active ? 'researched' : 'not-researched'">
              {{ variant.active ? 'active' : 'not researched' }}
            </span>
          </div>
          <span class="stat-chips">
            <span v-for="key in variant.diffKeys" :key="key" class="stat-chip changed">
              {{ formatStatLabel(key) }} {{ formatStatValue(key, variant.stats[key]) }}
            </span>
          </span>
          <div class="row-description" v-if="variant.description">
            {{ variant.description }}
          </div>
        </div>

        <!-- Flagship / Mech: only factions in the game -->
        <div v-for="entry in section.allFactions"
             :key="entry.factionId"
             class="unit-row variant-row">
          <div class="variant-header">
            <span class="player-pip" :style="{ background: entry.playerColor }" />
            <span class="faction-name">{{ entry.factionName }}</span>
            <span class="variant-unit-name">{{ entry.unitName }}</span>
          </div>
          <span class="stat-chips">
            <span class="stat-chip">Cost {{ formatCost(entry.stats) }}</span>
            <span class="stat-chip" v-if="entry.stats.combat">Cbt {{ entry.stats.combat }}</span>
            <span class="stat-chip" v-if="entry.stats.move">Move {{ entry.stats.move }}</span>
            <span class="stat-chip" v-if="entry.stats.capacity">Cap {{ entry.stats.capacity }}</span>
          </span>
          <div class="row-abilities" v-if="entry.stats.abilities?.length">
            {{ formatAbilities(entry.stats.abilities) }}
          </div>
          <div class="row-description" v-if="entry.description">
            {{ entry.description }}
          </div>
        </div>

      </div>
    </div>

    <template #footer>
      <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </template>
  </ModalBase>
</template>


<script>
import ModalBase from '@/components/ModalBase.vue'
import { twilight } from 'battlestar-common'
const res = twilight.res

const UNIT_ORDER = [
  'war-sun', 'dreadnought', 'carrier', 'cruiser', 'destroyer', 'fighter',
  'flagship',
  'infantry', 'mech',
  'pds', 'space-dock',
]

const STAT_KEYS = ['cost', 'costFor', 'combat', 'move', 'capacity', 'hits', 'abilities']

const STAT_LABELS = {
  cost: 'Cost',
  costFor: 'For',
  combat: 'Cbt',
  move: 'Move',
  capacity: 'Cap',
  hits: 'Hits',
  abilities: 'Abilities',
  productionValue: 'Prod',
}

export default {
  name: 'ShipOverviewModal',

  components: { ModalBase },

  inject: ['game'],

  computed: {
    players() {
      if (!this.game.state.initializationComplete) {
        return []
      }
      return this.game.players.all()
    },

    // Map factionId → player for quick lookup
    playerByFaction() {
      const map = {}
      for (const p of this.players) {
        if (p.factionId) {
          map[p.factionId] = p
        }
      }
      return map
    },

    unitSections() {
      const genericUpgrades = res.getUnitUpgrades()
      const gameFactions = this.players.map(p => p.faction).filter(Boolean)

      return UNIT_ORDER.map(type => {
        const base = res.getUnit(type)
        // War Sun tech is not a I→II upgrade; it unlocks the unit itself
        const genericUpgradeDef = type === 'war-sun'
          ? null
          : genericUpgrades.find(t => t.unitUpgrade === type && !t.faction) || null

        // Flagship and mech: only factions in the game
        if (type === 'flagship') {
          return {
            type,
            base,
            genericUpgrade: null,
            factionVariants: [],
            allFactions: this.players
              .filter(p => p.faction?.flagship)
              .map(p => ({
                factionId: p.factionId,
                factionName: p.faction.name,
                playerColor: p.color,
                unitName: p.faction.flagship.name,
                stats: p.faction.flagship,
                description: p.faction.flagship.description,
              })),
          }
        }

        if (type === 'mech') {
          return {
            type,
            base,
            genericUpgrade: null,
            factionVariants: [],
            allFactions: this.players
              .filter(p => p.faction?.mech)
              .map(p => ({
                factionId: p.factionId,
                factionName: p.faction.name,
                playerColor: p.color,
                unitName: p.faction.mech.name,
                stats: p.faction.mech,
                description: p.faction.mech.description,
              })),
          }
        }

        // Generic upgrade with ownership info and diff keys
        let genericUpgrade = null
        if (genericUpgradeDef) {
          const owners = this.players.filter(p => p.hasTechnology(genericUpgradeDef.id))
          const merged = { ...base, ...genericUpgradeDef.stats }
          genericUpgrade = {
            ...genericUpgradeDef,
            owners: owners.map(p => ({ name: p.name, color: p.color })),
            diffKeys: this.computeDiffKeys(base, merged),
          }
        }

        // Faction variants — only in-game factions
        const factionVariants = []

        for (const faction of gameFactions) {
          const player = this.playerByFaction[faction.id]

          // unitOverrides — always active for the faction
          if (faction.unitOverrides?.[type]) {
            const override = faction.unitOverrides[type]
            const merged = { ...base, ...override }
            const diffKeys = this.computeDiffKeys(base, merged)
            if (diffKeys.length > 0) {
              factionVariants.push({
                factionId: faction.id,
                factionName: faction.name,
                playerColor: player.color,
                source: 'base',
                unitName: override.name || base.name,
                stats: merged,
                description: override.description || null,
                diffKeys,
                active: true,
              })
            }
          }

          // Faction technologies with unitUpgrade
          if (faction.factionTechnologies) {
            for (const tech of faction.factionTechnologies) {
              if (tech.unitUpgrade === type && tech.stats) {
                const factionBase = faction.unitOverrides?.[type]
                  ? { ...base, ...faction.unitOverrides[type] }
                  : base
                const merged = { ...factionBase, ...tech.stats }
                const diffKeys = this.computeDiffKeys(base, merged)
                if (diffKeys.length > 0) {
                  factionVariants.push({
                    factionId: faction.id,
                    factionName: faction.name,
                    playerColor: player.color,
                    source: 'tech',
                    unitName: tech.name,
                    stats: merged,
                    description: tech.description || null,
                    diffKeys,
                    active: player.hasTechnology(tech.id),
                  })
                }
              }
            }
          }
        }

        // Sort: active first, then alphabetically
        factionVariants.sort((a, b) => {
          if (a.active !== b.active) {
            return a.active ? -1 : 1
          }
          return a.factionName.localeCompare(b.factionName)
        })

        return {
          type,
          base,
          genericUpgrade,
          factionVariants,
          allFactions: [],
        }
      })
    },
  },

  methods: {
    computeDiffKeys(base, variant) {
      const keys = []
      for (const key of STAT_KEYS) {
        const bv = base[key]
        const vv = variant[key]
        if (key === 'abilities') {
          if (JSON.stringify(bv || []) !== JSON.stringify(vv || [])) {
            keys.push(key)
          }
        }
        else if (bv !== vv && vv !== undefined) {
          keys.push(key)
        }
      }
      if (base.productionValue !== undefined || variant.productionValue !== undefined) {
        if (base.productionValue !== variant.productionValue && variant.productionValue !== undefined) {
          keys.push('productionValue')
        }
      }
      return keys
    },

    formatCost(unit) {
      if (!unit.cost && unit.cost !== 0) {
        return '-'
      }
      if (unit.costFor) {
        return `${unit.cost}/${unit.costFor}`
      }
      return String(unit.cost)
    },

    formatStatLabel(key) {
      return STAT_LABELS[key] || key
    },

    formatStatValue(key, value) {
      if (key === 'abilities') {
        return this.formatAbilities(value)
      }
      if (value === undefined || value === null) {
        return '-'
      }
      return String(value)
    },

    formatAbilities(abilities) {
      if (!abilities || abilities.length === 0) {
        return ''
      }
      return abilities.map(a => {
        return a
          .replace(/-(\d)/g, ' $1')
          .replace(/x(\d)/g, '\u00D7$1')
          .replace(/-/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase())
      }).join(', ')
    },
  },
}
</script>


<style scoped>
.ship-overview {
  font-size: .85em;
  max-height: 70vh;
  overflow-y: auto;
}

.unit-section {
  margin-bottom: 1em;
  border: 1px solid #dee2e6;
  border-radius: .35em;
  overflow: hidden;
}

.unit-header {
  display: flex;
  align-items: center;
  gap: .75em;
  padding: .5em .75em;
  background: #343a40;
  color: #fff;
  font-weight: 600;
}

.unit-name {
  font-size: 1.05em;
}

.base-row {
  background: #f8f9fa;
}

.unit-row {
  padding: .4em .75em;
  border-top: 1px solid #eee;
}

.upgrade-row {
  background: #f0f7ff;
}

.upgrade-header {
  display: flex;
  align-items: center;
  gap: .5em;
  margin-bottom: .15em;
}

.variant-row {
  background: #fff;
}

.variant-row:nth-child(even) {
  background: #fafafa;
}

.inactive {
  opacity: .4;
}

.variant-header {
  display: flex;
  align-items: center;
  gap: .5em;
  margin-bottom: .15em;
}

.player-pip {
  width: .7em;
  height: .7em;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid rgba(0,0,0,.15);
}

.player-pips {
  display: flex;
  gap: .2em;
  align-items: center;
}

.faction-name {
  font-weight: 600;
  font-size: .9em;
}

.variant-unit-name {
  font-size: .85em;
  color: #666;
  font-style: italic;
}

.source-badge {
  font-size: .7em;
  padding: .1em .35em;
  border-radius: .2em;
  text-transform: uppercase;
  font-weight: 600;
}

.source-badge.base {
  background: #e8f5e9;
  color: #2e7d32;
}

.source-badge.tech {
  background: #f3e5f5;
  color: #7b1fa2;
}

.tech-status {
  font-size: .7em;
  padding: .1em .35em;
  border-radius: .2em;
  font-weight: 600;
  margin-left: auto;
}

.tech-status.researched {
  background: #d4edda;
  color: #155724;
}

.tech-status.not-researched {
  background: #e9ecef;
  color: #888;
}

.row-label {
  font-weight: 600;
  font-size: .9em;
}

.stat-chips {
  display: flex;
  flex-wrap: wrap;
  gap: .3em;
}

.stat-chip {
  font-size: .8em;
  padding: .1em .4em;
  background: #f8f9fa;
  border-radius: .2em;
  white-space: nowrap;
}

.stat-chip.changed {
  background: #fff3cd;
  color: #664d03;
  font-weight: 600;
}

.row-abilities {
  font-size: .8em;
  color: #666;
  margin-top: .15em;
}

.row-description {
  font-size: .8em;
  color: #555;
  margin-top: .2em;
  padding: .3em .5em;
  background: #f8f9fa;
  border-radius: .2em;
  line-height: 1.3;
}

:deep(.modal-dialog) {
  max-width: 900px;
}
</style>
