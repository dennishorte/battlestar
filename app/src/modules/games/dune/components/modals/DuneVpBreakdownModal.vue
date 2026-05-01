<template>
  <ModalBase id="dune-vp-breakdown-modal">
    <template #header>{{ title }}</template>

    <div v-if="entries.length === 0" class="modal-empty">No Victory Points yet.</div>

    <table v-else class="vp-table">
      <thead>
        <tr>
          <th class="col-rd">Rd</th>
          <th>Source</th>
          <th class="col-amt">Δ</th>
          <th class="col-tot">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, idx) in entries" :key="idx">
          <td class="col-rd">{{ entry.round }}</td>
          <td>{{ entry.source }}</td>
          <td class="col-amt" :class="entry.amount < 0 ? 'neg' : 'pos'">
            {{ entry.amount > 0 ? '+' : '' }}{{ entry.amount }}
          </td>
          <td class="col-tot">{{ entry.total }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">Current</td>
          <td class="col-tot">{{ currentVp }}</td>
        </tr>
      </tfoot>
    </table>
  </ModalBase>
</template>


<script>
import ModalBase from '@/components/ModalBase.vue'

export default {
  name: 'DuneVpBreakdownModal',

  components: { ModalBase },

  inject: ['game', 'ui'],

  computed: {
    player() {
      return this.ui.modals.vpBreakdown?.player || null
    },

    title() {
      return this.player ? `${this.player.name} — VP Breakdown` : 'VP Breakdown'
    },

    rawEntries() {
      if (!this.player) {
        return []
      }
      return this.game.state.vpHistory?.[this.player.name] || []
    },

    entries() {
      let total = 0
      return this.rawEntries.map(e => {
        total += e.amount
        return { ...e, total }
      })
    },

    currentVp() {
      return this.player ? this.player.vp : 0
    },
  },
}
</script>


<style scoped>
.modal-empty {
  color: #8a7a68;
  font-style: italic;
  padding: .5em .25em;
}

.vp-table {
  width: 100%;
  font-size: .9em;
  border-collapse: collapse;
}

.vp-table th,
.vp-table td {
  padding: .25em .5em;
  border-bottom: 1px solid #e5dcc8;
  text-align: left;
}

.vp-table th {
  font-size: .75em;
  text-transform: uppercase;
  color: #8a7a68;
  border-bottom: 2px solid #d4c8a8;
}

.col-rd {
  width: 2.5em;
  text-align: center;
  color: #8a7a68;
}

.col-amt,
.col-tot {
  width: 3.5em;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.pos {
  color: #2e7d32;
}

.neg {
  color: #c62828;
}

.vp-table tfoot td {
  font-weight: bold;
  border-bottom: none;
  border-top: 2px solid #d4c8a8;
}
</style>
