<template>
  <ModalBase id="twilight-tech-tree">
    <template #header>Technology Tree</template>

    <div class="tech-tree">

      <!-- Color columns -->
      <div class="tech-columns">
        <div v-for="col in techColumns" :key="col.color" class="tech-column">
          <div class="column-header" :style="{ borderBottomColor: colors[col.color] }">
            {{ col.label }}
          </div>
          <div v-for="tier in col.tiers" :key="tier.level" class="tech-tier">
            <div
              v-for="tech in tier.techs"
              :key="tech.id"
              class="tech-node"
              :class="nodeClass(tech)"
              :style="nodeBorder(tech)"
              @click="showDetails(tech)"
            >
              <span class="prereq-dots" v-if="tech.prerequisites.length">
                <span
                  v-for="(prereq, i) in tech.prerequisites"
                  :key="i"
                  class="prereq-dot"
                  :style="{ backgroundColor: colors[prereq] || '#999' }"
                />
              </span>
              <span class="tech-name">{{ tech.name }}</span>
              <span class="player-pips" v-if="techOwners(tech.id).length">
                <span
                  v-for="p in techOwners(tech.id)"
                  :key="p.name"
                  class="player-pip"
                  :style="{ background: p.color }"
                  :title="p.name"
                />
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Unit Upgrades -->
      <div class="section-header">Unit Upgrades</div>
      <div class="unit-upgrades-row">
        <div
          v-for="tech in unitUpgrades"
          :key="tech.id"
          class="tech-node"
          :class="nodeClass(tech)"
          :style="nodeBorder(tech)"
          @click="showDetails(tech)"
        >
          <span class="prereq-dots" v-if="tech.prerequisites.length">
            <span
              v-for="(prereq, i) in tech.prerequisites"
              :key="i"
              class="prereq-dot"
              :style="{ backgroundColor: colors[prereq] || '#999' }"
            />
          </span>
          <span class="tech-name">{{ tech.name }}</span>
          <span class="player-pips" v-if="techOwners(tech.id).length">
            <span
              v-for="p in techOwners(tech.id)"
              :key="p.name"
              class="player-pip"
              :style="{ background: p.color }"
              :title="p.name"
            />
          </span>
        </div>
      </div>

      <!-- Faction Technologies -->
      <template v-if="factionTechs.length">
        <div class="section-header">Faction Technologies</div>
        <div class="faction-techs-row">
          <div
            v-for="tech in factionTechs"
            :key="tech.id"
            class="tech-node"
            :class="nodeClass(tech)"
            :style="nodeBorder(tech)"
            @click="showDetails(tech)"
          >
            <span class="prereq-dots" v-if="tech.prerequisites.length">
              <span
                v-for="(prereq, i) in tech.prerequisites"
                :key="i"
                class="prereq-dot"
                :style="{ backgroundColor: colors[prereq] || '#999' }"
              />
            </span>
            <span class="tech-name">{{ tech.name }}</span>
            <span class="player-pips" v-if="techOwners(tech.id).length">
              <span
                v-for="p in techOwners(tech.id)"
                :key="p.name"
                class="player-pip"
                :style="{ background: p.color }"
                :title="p.name"
              />
            </span>
          </div>
        </div>
      </template>

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

const colors = {
  blue: '#0d6efd',
  red: '#dc3545',
  yellow: '#ffc107',
  green: '#198754',
  'unit-upgrade': '#6c757d',
}

const colorLabels = {
  blue: 'Propulsion',
  red: 'Warfare',
  yellow: 'Cybernetic',
  green: 'Biotic',
}

const COLOR_ORDER = ['blue', 'red', 'yellow', 'green']

export default {
  name: 'TechTreeModal',

  components: { ModalBase },

  inject: ['actor', 'game', 'ui'],

  data() {
    return { colors }
  },

  computed: {
    players() {
      if (!this.game.state.initializationComplete) {
        return []
      }
      return this.game.players.all()
    },

    viewingPlayer() {
      if (!this.game.state.initializationComplete) {
        return null
      }
      return this.game.players.byName(this.actor.name)
    },

    techColumns() {
      return COLOR_ORDER.map(color => {
        const techs = res.getByColor(color)
        // Group by tier (number of same-color prerequisites)
        const tierMap = {}
        for (const tech of techs) {
          const tier = tech.prerequisites.filter(p => p === color).length
          if (!tierMap[tier]) {
            tierMap[tier] = []
          }
          tierMap[tier].push(tech)
        }
        const tiers = Object.keys(tierMap)
          .map(Number)
          .sort((a, b) => a - b)
          .map(level => ({ level, techs: tierMap[level] }))

        return {
          color,
          label: colorLabels[color],
          tiers,
        }
      })
    },

    unitUpgrades() {
      return res.getUnitUpgrades().filter(t => !t.faction)
    },

    factionTechs() {
      if (!this.viewingPlayer?.faction) {
        return []
      }
      return this.viewingPlayer.faction.factionTechnologies || []
    },
  },

  methods: {
    techOwners(techId) {
      return this.players
        .filter(p => p.hasTechnology(techId))
        .map(p => ({ name: p.name, color: p.color }))
    },

    nodeClass(tech) {
      if (!this.viewingPlayer) {
        return {}
      }
      const owned = this.viewingPlayer.hasTechnology(tech.id)
      if (owned) {
        return { owned: true }
      }
      const canResearch = this.viewingPlayer.canResearchTechnology(tech.id)
      if (canResearch) {
        return { researchable: true }
      }
      return { locked: true }
    },

    nodeBorder(tech) {
      const color = colors[tech.color] || '#6c757d'
      return { borderLeftColor: color }
    },

    showDetails(tech) {
      this.ui.modals.cardDetail.type = 'technology'
      this.ui.modals.cardDetail.id = tech.id
      this.ui.modals.cardDetail.context = null
      this.$modal('twilight-card-detail').show()
    },
  },
}
</script>


<style scoped>
.tech-tree {
  font-size: .85em;
  max-height: 70vh;
  overflow-y: auto;
}

.tech-columns {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: .5em;
}

.tech-column {
  min-width: 0;
}

.column-header {
  font-weight: 700;
  font-size: .9em;
  text-align: center;
  padding: .3em 0;
  border-bottom: 3px solid;
  margin-bottom: .4em;
}

.tech-tier {
  margin-bottom: .3em;
}

.tech-tier + .tech-tier {
  border-top: 1px dashed #dee2e6;
  padding-top: .3em;
}

.tech-node {
  display: flex;
  align-items: center;
  gap: .3em;
  padding: .3em .4em;
  margin-bottom: .25em;
  border-left: 4px solid;
  border-radius: .2em;
  background: #f0f2f5;
  cursor: pointer;
  transition: opacity .15s;
}

.tech-node:hover {
  background: #e3e6ea;
}

.tech-node.owned {
  background: #d4edda;
  border-color: #198754 !important;
}

.tech-node.researchable {
  background: #fff3cd;
}

.tech-node.locked {
  opacity: .45;
}

.tech-name {
  font-weight: 600;
  font-size: .85em;
  line-height: 1.2;
}

.prereq-dots {
  display: flex;
  gap: .15em;
  flex-shrink: 0;
}

.prereq-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.player-pips {
  display: flex;
  gap: .2em;
  margin-left: auto;
  flex-shrink: 0;
}

.player-pip {
  width: .6em;
  height: .6em;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid rgba(0,0,0,.15);
}

.section-header {
  font-weight: 700;
  font-size: .9em;
  margin-top: .75em;
  margin-bottom: .35em;
  padding-bottom: .2em;
  border-bottom: 2px solid #6c757d;
}

.unit-upgrades-row,
.faction-techs-row {
  display: flex;
  flex-wrap: wrap;
  gap: .4em;
}

.unit-upgrades-row .tech-node,
.faction-techs-row .tech-node {
  flex: 0 0 auto;
  max-width: 180px;
}

:deep(.modal-dialog) {
  max-width: 900px;
}
</style>
