<template>
  <div v-if="entries.length === 0" class="modal-empty">No history yet.</div>

  <table v-else class="counter-history-table">
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
        <td>{{ entry.source?.label || '—' }}</td>
        <td class="col-amt" :class="entry.delta < 0 ? 'neg' : 'pos'">
          {{ entry.delta > 0 ? '+' : '' }}{{ entry.delta }}
        </td>
        <td class="col-tot">{{ entry.total }}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3">Current</td>
        <td class="col-tot">{{ currentValue }}</td>
      </tr>
    </tfoot>
  </table>
</template>


<script>
// Renders one player's counterHistory entries for a single counter.
// State shape (written by BasePlayer.incrementCounter / setCounter):
//   game.state.counterHistory[playerName] = [
//     { counter, delta, total, source: { label, ref? } | null, round, turn },
//     ...
//   ]
export default {
  name: 'CounterHistoryTable',

  inject: ['game'],

  props: {
    playerName: { type: String, required: true },
    counterName: { type: String, required: true },
    currentValue: { type: Number, required: true },
  },

  computed: {
    entries() {
      const all = this.game.state.counterHistory?.[this.playerName] || []
      return all.filter(e => e.counter === this.counterName)
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

.counter-history-table {
  width: 100%;
  font-size: .9em;
  border-collapse: collapse;
}

.counter-history-table th,
.counter-history-table td {
  padding: .25em .5em;
  border-bottom: 1px solid #e5dcc8;
  text-align: left;
}

.counter-history-table th {
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

.counter-history-table tfoot td {
  font-weight: bold;
  border-bottom: none;
  border-top: 2px solid #d4c8a8;
}
</style>
