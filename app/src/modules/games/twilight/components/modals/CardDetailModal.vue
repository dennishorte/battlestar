<template>
  <ModalBase id="twilight-card-detail">
    <template #header>
      {{ title }}
    </template>

    <div class="card-detail" v-if="type">

      <!-- Technology -->
      <div v-if="type === 'technology' && techData">
        <div class="detail-row">
          <span class="color-badge" :class="`badge-${techData.color}`">{{ techData.color }}</span>
          <span v-if="techData.faction" class="faction-badge">Faction</span>
          <span v-if="techData.unitUpgrade" class="unit-upgrade-name">Upgrades {{ techData.unitUpgrade }}</span>
        </div>
        <div class="detail-row" v-if="techData.prerequisites.length > 0">
          <span class="info-key">Prerequisites:</span>
          <span class="prereq-list">
            <span v-for="(pre, i) in techData.prerequisites"
                  :key="i"
                  class="prereq-pip"
                  :class="`pip-${pre}`"/>
          </span>
        </div>
        <div class="detail-row" v-if="techData.stats">
          <span class="info-key">Stats:</span>
          <span v-for="(val, key) in techData.stats" :key="key" class="stat-entry">
            {{ key }}: {{ val }}
          </span>
        </div>
        <div class="description-text" v-if="techData.description">
          {{ techData.description }}
        </div>
      </div>

      <!-- Planet -->
      <div v-if="type === 'planet' && planetData">
        <div class="detail-row">
          <span class="info-key">Resources:</span>
          <span class="stat-value resource-val">{{ planetData.resources }}</span>
          <span class="info-key" style="margin-left: .75em;">Influence:</span>
          <span class="stat-value influence-val">{{ planetData.influence }}</span>
        </div>
        <div class="detail-row" v-if="planetData.trait">
          <span class="info-key">Trait:</span>
          <span class="trait-badge" :class="`trait-${planetData.trait}`">{{ planetData.trait }}</span>
        </div>
        <div class="detail-row" v-if="planetData.techSpecialty">
          <span class="info-key">Tech Specialty:</span>
          <span class="tech-spec" :class="`spec-${planetData.techSpecialty}`">{{ planetData.techSpecialty }}</span>
        </div>
        <div class="detail-row" v-if="planetData.legendary">
          <span class="legendary-badge">Legendary</span>
        </div>
        <div class="detail-row" v-if="planetState">
          <span class="info-key">Controller:</span>
          <span>{{ planetState.controller || 'None' }}</span>
          <span v-if="planetState.exhausted" class="exhausted-badge">exhausted</span>
        </div>
      </div>

      <!-- Objective -->
      <div v-if="type === 'objective' && objectiveData">
        <div class="detail-row">
          <span class="stage-badge" :class="`stage-${objectiveData.stage}`">Stage {{ objectiveData.stage }}</span>
          <span class="points-badge">{{ objectiveData.points }} VP</span>
          <span v-if="objectiveData.type === 'secret'" class="secret-badge">Secret</span>
        </div>
        <div class="condition-text" v-if="objectiveData.condition">
          {{ objectiveData.condition }}
        </div>
      </div>

      <!-- Strategy Card -->
      <div v-if="type === 'strategy-card' && strategyCardData">
        <div class="detail-row">
          <span class="sc-number-badge">{{ strategyCardData.number }}</span>
          <span>{{ strategyCardData.name }}</span>
        </div>
      </div>

      <!-- Leader -->
      <div v-if="type === 'leader' && leaderData">
        <div class="detail-row">
          <span class="leader-role-badge" :class="`role-${context?.role}`">{{ context?.role }}</span>
          <span class="leader-status" :class="leaderStatusClass">{{ leaderStatus }}</span>
        </div>
        <div class="description-text" v-if="leaderData.description">
          {{ leaderData.description }}
        </div>
        <div class="detail-row" v-if="leaderData.unlockCondition">
          <span class="info-key">Unlock:</span>
          <span>{{ leaderData.unlockCondition }}</span>
        </div>
      </div>

      <!-- Promissory Note -->
      <div v-if="type === 'promissory-note' && promissoryData">
        <div class="detail-row" v-if="context?.owner">
          <span class="info-key">From:</span>
          <span>{{ context.owner }}</span>
        </div>
        <div class="detail-row" v-if="promissoryData.timing">
          <span class="info-key">Timing:</span>
          <span class="timing-badge">{{ promissoryData.timing }}</span>
        </div>
        <div class="description-text" v-if="promissoryData.description">
          {{ promissoryData.description }}
        </div>
      </div>

      <!-- Faction Ability -->
      <div v-if="type === 'faction-ability'">
        <div class="description-text" v-if="context?.description">
          {{ context.description }}
        </div>
      </div>

      <!-- Faction Detail -->
      <div v-if="type === 'faction' && factionData">

        <!-- Faction Abilities -->
        <div v-if="factionData.abilities?.length > 0" class="faction-section">
          <div class="faction-section-label">Abilities</div>
          <div v-for="ability in factionData.abilities" :key="ability.id" class="faction-ability-item">
            <div class="faction-ability-name">{{ ability.name }}</div>
            <div class="description-text">{{ ability.description }}</div>
          </div>
        </div>

        <!-- Flagship -->
        <div v-if="factionData.flagship" class="faction-section">
          <div class="faction-section-label">Flagship</div>
          <div class="faction-unit-header">{{ factionData.flagship.name }}</div>
          <div class="detail-row">
            <span class="stat-entry">Cost: {{ factionData.flagship.cost }}</span>
            <span class="stat-entry">Combat: {{ factionData.flagship.combat }}</span>
            <span class="stat-entry">Move: {{ factionData.flagship.move }}</span>
            <span class="stat-entry">Capacity: {{ factionData.flagship.capacity }}</span>
          </div>
          <div class="description-text" v-if="factionData.flagship.description">
            {{ factionData.flagship.description }}
          </div>
        </div>

        <!-- Mech -->
        <div v-if="factionData.mech" class="faction-section">
          <div class="faction-section-label">Mech</div>
          <div class="faction-unit-header">{{ factionData.mech.name }}</div>
          <div class="detail-row">
            <span class="stat-entry">Cost: {{ factionData.mech.cost }}</span>
            <span class="stat-entry">Combat: {{ factionData.mech.combat }}</span>
          </div>
          <div class="description-text" v-if="factionData.mech.description">
            {{ factionData.mech.description }}
          </div>
        </div>

        <!-- Leaders -->
        <div v-if="factionData.leaders" class="faction-section">
          <div class="faction-section-label">Leaders</div>
          <div v-for="role in ['agent', 'commander', 'hero']" :key="role">
            <div v-if="factionData.leaders[role]" class="faction-leader-item">
              <div class="detail-row">
                <span class="leader-role-badge" :class="`role-${role}`">{{ role }}</span>
                <span class="faction-leader-name">{{ factionData.leaders[role].name }}</span>
              </div>
              <div class="description-text">{{ factionData.leaders[role].description }}</div>
              <div class="detail-row" v-if="factionData.leaders[role].unlockCondition">
                <span class="info-key">Unlock:</span>
                <span>{{ factionData.leaders[role].unlockCondition }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Promissory Note -->
        <div v-if="factionData.promissoryNote" class="faction-section">
          <div class="faction-section-label">Promissory Note</div>
          <div class="faction-ability-name">{{ factionData.promissoryNote.name }}</div>
          <div class="description-text">{{ factionData.promissoryNote.description }}</div>
        </div>

        <!-- Faction Technologies -->
        <div v-if="factionData.factionTechnologies?.length > 0" class="faction-section">
          <div class="faction-section-label">Faction Technologies</div>
          <div v-for="tech in factionData.factionTechnologies" :key="tech.id" class="faction-tech-item">
            <div class="detail-row">
              <span class="faction-ability-name">{{ tech.name }}</span>
              <span v-if="tech.color" class="color-badge" :class="`badge-${tech.color}`">{{ tech.color }}</span>
            </div>
            <div class="detail-row" v-if="tech.prerequisites?.length > 0">
              <span class="info-key">Prerequisites:</span>
              <span class="prereq-list">
                <span v-for="(pre, i) in tech.prerequisites"
                      :key="i"
                      class="prereq-pip"
                      :class="`pip-${pre}`"/>
              </span>
            </div>
            <div class="description-text" v-if="tech.description">{{ tech.description }}</div>
          </div>
        </div>

        <!-- Unit Overrides -->
        <div v-if="factionData.unitOverrides && Object.keys(factionData.unitOverrides).length > 0" class="faction-section">
          <div class="faction-section-label">Unique Units</div>
          <div v-for="(unit, unitType) in factionData.unitOverrides" :key="unitType" class="faction-unit-item">
            <div class="detail-row">
              <span class="faction-ability-name">{{ unit.name }}</span>
              <span class="info-key">({{ unitType }})</span>
            </div>
            <div class="detail-row" v-if="unit.combat">
              <span class="stat-entry">Combat: {{ unit.combat }}</span>
            </div>
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

export default {
  name: 'CardDetailModal',

  components: { ModalBase },

  inject: ['game', 'ui'],

  computed: {
    modalData() {
      return this.ui?.modals?.cardDetail
    },

    type() {
      return this.modalData?.type || null
    },

    id() {
      return this.modalData?.id || null
    },

    context() {
      return this.modalData?.context || null
    },

    title() {
      if (this.type === 'technology' && this.techData) {
        return this.techData.name
      }
      if (this.type === 'planet' && this.planetData) {
        return this.planetData.name
      }
      if (this.type === 'objective' && this.objectiveData) {
        return this.objectiveData.name
      }
      if (this.type === 'strategy-card' && this.strategyCardData) {
        return this.strategyCardData.name
      }
      if (this.type === 'leader' && this.leaderData) {
        return this.leaderData.name
      }
      if (this.type === 'promissory-note' && this.promissoryData) {
        return this.promissoryData.name
      }
      if (this.type === 'faction-ability') {
        return this.context?.name || 'Faction Ability'
      }
      if (this.type === 'faction' && this.factionData) {
        return this.factionData.name
      }
      return 'Details'
    },

    techData() {
      if (this.type !== 'technology' || !this.id) {
        return null
      }
      return res.getTechnology(this.id)
    },

    planetData() {
      if (this.type !== 'planet' || !this.id) {
        return null
      }
      return res.getPlanet(this.id)
    },

    planetState() {
      if (!this.planetData) {
        return null
      }
      return this.game.state.planets[this.id] || null
    },

    objectiveData() {
      if (this.type !== 'objective' || !this.id) {
        return null
      }
      return res.getObjective(this.id)
    },

    strategyCardData() {
      if (this.type !== 'strategy-card' || !this.id) {
        return null
      }
      return res.getStrategyCard(this.id)
    },

    leaderData() {
      if (this.type !== 'leader' || !this.id || !this.context?.role) {
        return null
      }
      const faction = res.getFaction(this.id)
      if (!faction?.leaders) {
        return null
      }
      return faction.leaders[this.context.role] || null
    },

    leaderStatus() {
      if (!this.context?.status) {
        return 'unknown'
      }
      return this.context.status
    },

    leaderStatusClass() {
      const s = this.leaderStatus
      if (s === 'ready' || s === 'unlocked') {
        return 'status-ready'
      }
      if (s === 'exhausted') {
        return 'status-exhausted'
      }
      if (s === 'purged') {
        return 'status-purged'
      }
      return 'status-locked'
    },

    promissoryData() {
      if (this.type !== 'promissory-note' || !this.id) {
        return null
      }
      // Try generic first, then check faction promissory
      const generic = res.getPromissoryNote(this.id)
      if (generic) {
        return generic
      }
      // Check faction promissory notes
      if (this.context?.factionId) {
        const faction = res.getFaction(this.context.factionId)
        if (faction?.promissoryNote?.id === this.id) {
          return faction.promissoryNote
        }
      }
      return null
    },

    factionData() {
      if (this.type !== 'faction' || !this.id) {
        return null
      }
      return res.getFaction(this.id)
    },
  },
}
</script>

<style scoped>
.card-detail {
  font-size: .9em;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: .5em;
  padding: .2em 0;
}

.info-key {
  color: #888;
  font-size: .9em;
}

.color-badge {
  font-size: .8em;
  padding: .15em .5em;
  border-radius: .2em;
  text-transform: capitalize;
  font-weight: 600;
}

.badge-blue { background: #e3f2fd; color: #0d6efd; }
.badge-red { background: #fce4ec; color: #dc3545; }
.badge-yellow { background: #fff9c4; color: #f57f17; }
.badge-green { background: #e8f5e9; color: #198754; }
.badge-unit-upgrade { background: #f3e5f5; color: #6c757d; }

.faction-badge {
  font-size: .75em;
  padding: .1em .4em;
  background: #fff3e0;
  color: #e65100;
  border-radius: .2em;
  font-weight: 600;
}

.prereq-list {
  display: flex;
  gap: .25em;
}

.prereq-pip {
  width: .9em;
  height: .9em;
  border-radius: 50%;
}

.pip-blue { background: #0d6efd; }
.pip-red { background: #dc3545; }
.pip-yellow { background: #ffc107; }
.pip-green { background: #198754; }

.unit-upgrade-name {
  text-transform: capitalize;
}

.stat-entry {
  font-size: .85em;
  padding: .1em .35em;
  background: #f8f9fa;
  border-radius: .15em;
  text-transform: capitalize;
}

.stat-value {
  font-weight: 700;
  font-size: 1.1em;
}

.resource-val { color: #ffc107; }
.influence-val { color: #0d6efd; }

.trait-badge {
  font-size: .85em;
  padding: .1em .4em;
  border-radius: .2em;
  text-transform: capitalize;
  font-weight: 500;
}

.trait-cultural { background: #bbdefb; color: #1565c0; }
.trait-hazardous { background: #ffcdd2; color: #c62828; }
.trait-industrial { background: #c8e6c9; color: #2e7d32; }

.tech-spec {
  font-size: .85em;
  padding: .1em .4em;
  border-radius: .2em;
  text-transform: capitalize;
  font-weight: 500;
}

.spec-blue { background: #e3f2fd; color: #0d6efd; }
.spec-red { background: #fce4ec; color: #dc3545; }
.spec-yellow { background: #fff9c4; color: #f57f17; }
.spec-green { background: #e8f5e9; color: #198754; }

.legendary-badge {
  font-size: .85em;
  padding: .1em .5em;
  background: #fff3e0;
  color: #e65100;
  border-radius: .2em;
  font-weight: 600;
}

.exhausted-badge {
  font-size: .8em;
  color: #999;
  font-style: italic;
}

.stage-badge {
  font-size: .8em;
  padding: .15em .5em;
  border-radius: .2em;
  font-weight: 600;
}

.stage-1 { background: #fff9c4; color: #f57f17; }
.stage-2 { background: #e3f2fd; color: #0d6efd; }

.points-badge {
  font-size: .85em;
  font-weight: 700;
  padding: .1em .4em;
  background: #e8f5e9;
  color: #198754;
  border-radius: .2em;
}

.secret-badge {
  font-size: .75em;
  padding: .1em .4em;
  background: #f3e5f5;
  color: #7b1fa2;
  border-radius: .2em;
  font-weight: 600;
}

.condition-text, .description-text {
  margin-top: .5em;
  padding: .5em;
  background: #f8f9fa;
  border-radius: .25em;
  line-height: 1.4;
  font-size: .9em;
}

.sc-number-badge {
  font-weight: 700;
  font-size: 1.2em;
  width: 1.6em;
  height: 1.6em;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #343a40;
  color: white;
  border-radius: 50%;
}

.leader-role-badge {
  font-size: .8em;
  padding: .15em .5em;
  border-radius: .2em;
  text-transform: capitalize;
  font-weight: 600;
}

.role-agent { background: #e3f2fd; color: #0d6efd; }
.role-commander { background: #e8f5e9; color: #198754; }
.role-hero { background: #fff3e0; color: #e65100; }

.leader-status {
  font-size: .8em;
  padding: .1em .4em;
  border-radius: .2em;
  text-transform: capitalize;
}

.status-ready { background: #d4edda; color: #155724; }
.status-exhausted { background: #fff3cd; color: #856404; }
.status-locked { background: #e9ecef; color: #aaa; }
.status-purged { background: #f8d7da; color: #721c24; }

.timing-badge {
  font-size: .85em;
  padding: .1em .4em;
  background: #e9ecef;
  border-radius: .2em;
  text-transform: capitalize;
}

.faction-section {
  margin-top: .75em;
  padding-top: .5em;
  border-top: 1px solid #eee;
}

.faction-section:first-child {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.faction-section-label {
  font-size: .75em;
  color: #888;
  text-transform: uppercase;
  letter-spacing: .05em;
  margin-bottom: .25em;
  font-weight: 600;
}

.faction-ability-item, .faction-tech-item, .faction-unit-item {
  margin-bottom: .5em;
}

.faction-ability-name {
  font-weight: 600;
  font-size: .95em;
}

.faction-unit-header {
  font-weight: 600;
  font-size: .95em;
  margin-bottom: .15em;
}

.faction-leader-item {
  margin-bottom: .5em;
}

.faction-leader-name {
  font-weight: 600;
}
</style>
