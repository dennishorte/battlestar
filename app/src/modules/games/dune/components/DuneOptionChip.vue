<template>
  <span class="dune-chip" :class="chipClass" @click.stop="showModal = true">
    <span class="chip-name">{{ name }}</span>
    <span class="chip-detail" v-if="detail">{{ detail }}</span>
  </span>

  <teleport to="body">
    <div v-if="showModal" class="dune-modal-backdrop" @click="showModal = false">
      <div class="dune-modal" @click.stop>
        <div class="modal-header">
          <strong>{{ name }}</strong>
          <button class="modal-close" @click="showModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <template v-if="leader">
            <div class="field"><span class="label">House:</span> {{ leader.house || 'None' }}</div>
            <div class="field" v-if="leader.startingEffect">
              <span class="label">Starting:</span>
              <div v-for="(line, i) in textLines(leader.startingEffect)"
                   :key="i"
                   :class="line.startsWith('·') ? 'bullet' : ''">{{ line }}</div>
            </div>
            <div class="field">
              <span class="label">Ability:</span>
              <div v-for="(line, i) in textLines(leader.leaderAbility)"
                   :key="i"
                   :class="line.startsWith('·') ? 'bullet' : ''">{{ line }}</div>
            </div>
            <div class="field" v-if="leader.signetRingAbility">
              <span class="label">Signet Ring:</span>
              <div v-for="(line, i) in textLines(leader.signetRingAbility)"
                   :key="i"
                   :class="line.startsWith('·') ? 'bullet' : ''">{{ line }}</div>
            </div>
          </template>
          <template v-else-if="card">
            <div class="field" v-if="card.persuasionCost">
              <span class="label">Cost:</span> {{ card.persuasionCost }}
            </div>
            <div class="field" v-if="card.agentIcons?.length">
              <span class="label">Agent Icons:</span> {{ card.agentIcons.join(', ') }}
            </div>
            <div class="field" v-if="card.factionAccess?.length">
              <span class="label">Faction Access:</span> {{ card.factionAccess.join(', ') }}
            </div>
            <div class="field" v-if="card.agentAbility">
              <span class="label">Agent:</span>
              <div v-for="(line, i) in textLines(card.agentAbility)"
                   :key="i"
                   :class="line.startsWith('·') ? 'bullet' : ''">{{ line }}</div>
            </div>
            <div class="field" v-if="revealText">
              <span class="label">Reveal:</span>
              <div v-for="(line, i) in textLines(revealText)"
                   :key="i"
                   :class="line.startsWith('·') ? 'bullet' : ''">{{ line }}</div>
            </div>
            <div class="field" v-if="card.passiveAbility">
              <span class="label">Passive:</span>
              <div v-for="(line, i) in textLines(card.passiveAbility)"
                   :key="i"
                   :class="line.startsWith('·') ? 'bullet' : ''">{{ line }}</div>
            </div>
            <div class="field" v-if="card.acquisitionBonus">
              <span class="label">Acquire:</span>
              <div v-for="(line, i) in textLines(card.acquisitionBonus)"
                   :key="i"
                   :class="line.startsWith('·') ? 'bullet' : ''">{{ line }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </teleport>
</template>


<script>
export default {
  name: 'DuneOptionChip',

  props: {
    name: { type: String, required: true },
    card: { type: Object, default: null },
    leader: { type: Object, default: null },
  },

  data() {
    return { showModal: false }
  },

  methods: {
    textLines(text) {
      if (!text) {
        return []
      }
      return text.split('\n').filter(l => l.trim())
    },
  },

  computed: {
    chipClass() {
      if (this.leader) {
        return 'chip-leader'
      }
      if (this.card?.factionAffiliation) {
        return `chip-faction-${this.card.factionAffiliation}`
      }
      return 'chip-card'
    },

    detail() {
      if (this.leader) {
        return ''
      }
      if (this.card?.persuasionCost) {
        return `${this.card.persuasionCost}`
      }
      return ''
    },

    revealText() {
      if (!this.card) {
        return null
      }
      const parts = []
      if (this.card.revealPersuasion > 0) {
        parts.push(`+${this.card.revealPersuasion} persuasion`)
      }
      if (this.card.revealSwords > 0) {
        parts.push(`+${this.card.revealSwords} sword${this.card.revealSwords > 1 ? 's' : ''}`)
      }
      if (this.card.revealAbility) {
        parts.push(this.card.revealAbility)
      }
      return parts.join(', ') || null
    },
  },
}
</script>


<style scoped>
.dune-chip {
  display: inline-flex;
  align-items: center;
  gap: .4em;
  padding: .15em .5em;
  border-radius: .25em;
  cursor: pointer;
  border: 1px solid #d4c8a8;
  background-color: #f5f0e8;
  transition: background-color .1s;
}

.dune-chip:hover {
  background-color: #e8dcc0;
}

.chip-name {
  font-weight: 600;
  color: #2c2416;
}

.chip-detail {
  font-size: .85em;
  color: #8a7a68;
}

.chip-leader {
  border-color: #6a3d8a;
  background-color: #f3eef8;
}
.chip-leader:hover { background-color: #e8ddf0; }

.chip-faction-emperor { border-color: #8b2020; }
.chip-faction-guild { border-color: #c07020; }
.chip-faction-bene-gesserit { border-color: #5b3a8a; }
.chip-faction-fremen { border-color: #2a6090; }

.dune-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.dune-modal {
  background: white;
  border-radius: .5em;
  min-width: 300px;
  max-width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, .3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .6em .8em;
  border-bottom: 1px solid #e8e0d0;
  font-size: 1.1em;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.4em;
  cursor: pointer;
  color: #8a7a68;
  line-height: 1;
}

.modal-body {
  padding: .6em .8em;
}

.field {
  margin-bottom: .4em;
  line-height: 1.4;
}

.bullet {
  padding-left: 1em;
}

.label {
  font-weight: 600;
  color: #8b6914;
  margin-right: .3em;
}
</style>
