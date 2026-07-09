<template>
  <ModalBase id="dune-strength-breakdown-modal">
    <template #header>{{ title }}</template>

    <div class="strength-breakdown" v-if="player">
      <div class="total-line">
        <span class="total-label">Total Strength</span>
        <span class="total-value">{{ total }}</span>
      </div>

      <ul v-if="items.length" class="breakdown-list">
        <li v-for="(item, i) in items" :key="i">
          <span class="item-label">{{ item.label }}</span>
          <span class="item-amount">+{{ item.amount }}</span>
        </li>
      </ul>
      <p v-else class="no-items-note">
        No strength contributions yet.
      </p>
    </div>

    <template #footer>
      <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </template>
  </ModalBase>
</template>


<script>
import ModalBase from '@/components/ModalBase.vue'
import { dune } from 'battlestar-common'

const { TROOP_STRENGTH, SANDWORM_STRENGTH } = dune.res.constants

export default {
  name: 'DuneStrengthBreakdownModal',

  components: { ModalBase },

  inject: ['game', 'ui'],

  computed: {
    player() {
      return this.ui.modals.strengthBreakdown?.player || null
    },

    title() {
      return this.player ? `${this.player.name} — Strength Breakdown` : 'Strength Breakdown'
    },

    troops() {
      return this.player
        ? (this.game.state.conflict.deployedTroops?.[this.player.name] || 0)
        : 0
    },

    sandworms() {
      return this.player
        ? (this.game.state.conflict.deployedSandworms?.[this.player.name] || 0)
        : 0
    },

    total() {
      return this.player ? this.player.strength : 0
    },

    // Mirrors DunePlayer#strength in common/dune/DunePlayer.js: troops and
    // sandworms are read live off Conflict state (so they can never go
    // stale), while card/leader/intrigue bonuses come from the logged
    // strengthBreakdown entries.
    items() {
      if (!this.player) {
        return []
      }
      const list = []
      if (this.troops > 0) {
        list.push({
          label: `${this.troops} Troop${this.troops > 1 ? 's' : ''} in Conflict`,
          amount: this.troops * TROOP_STRENGTH,
        })
      }
      if (this.sandworms > 0) {
        list.push({
          label: `${this.sandworms} Sandworm${this.sandworms > 1 ? 's' : ''} in Conflict`,
          amount: this.sandworms * SANDWORM_STRENGTH,
        })
      }
      const extra = this.game.state.conflict.strengthBreakdown?.[this.player.name] || []
      for (const entry of extra) {
        if (entry.source !== 'troops' && entry.source !== 'sandworms') {
          list.push({ label: entry.label, amount: entry.amount })
        }
      }
      return list
    },
  },
}
</script>


<style scoped>
.strength-breakdown {
  font-size: .9em;
  color: #2c2416;
}

.total-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .4em .6em;
  margin-bottom: .6em;
  border-radius: .3em;
  background-color: #f8eecc;
  border: 1px solid #d4c090;
  font-weight: 700;
}

.total-value {
  font-size: 1.2em;
  color: #8b6914;
}

.breakdown-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.breakdown-list li {
  display: flex;
  justify-content: space-between;
  padding: .3em .2em;
  border-bottom: 1px solid #ece4d0;
}

.breakdown-list li:last-child {
  border-bottom: none;
}

.item-label {
  color: #4a3a20;
}

.item-amount {
  font-weight: 600;
  color: #3a6b1f;
  font-variant-numeric: tabular-nums;
}

.no-items-note {
  color: #8a7a68;
  font-style: italic;
  margin: 0;
}
</style>
