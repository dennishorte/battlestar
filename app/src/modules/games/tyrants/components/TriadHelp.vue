<template>
  <div class="triad-help">
    <p>Control all three Zelatar sites (Fogtown, Gallenghast, Darkflame) to earn bonuses each turn:</p>
    <table class="table table-dark table-sm mb-0">
      <thead>
        <tr>
          <th>Tier</th>
          <th>Condition</th>
          <th>Bonus per turn</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="tier-presence">Presence</td>
          <td>Troops in all 3 sites</td>
          <td>+1 Power</td>
        </tr>
        <tr>
          <td class="tier-control">Control</td>
          <td>Most troops in all 3 sites</td>
          <td>+1 Power, +1 Trophy, +1 VP</td>
        </tr>
        <tr>
          <td class="tier-total">Total Control</td>
          <td>Only your troops in all 3 sites</td>
          <td>+2 Power, +2 Trophies, +4 VP</td>
        </tr>
      </tbody>
    </table>
    <p class="mt-2 mb-0 text-muted small">Only the highest qualifying tier applies each turn.</p>
  </div>
</template>

<script>
export default {
  name: 'TriadHelp',
}
</script>

<style scoped>
.tier-presence {
  color: #c9a84c;
}

.tier-control {
  color: #e0c068;
  font-weight: 600;
}

.tier-total {
  color: #ffd700;
  font-weight: 700;
}
</style>
