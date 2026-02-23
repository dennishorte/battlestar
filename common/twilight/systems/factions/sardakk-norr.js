module.exports = {
  getCombatModifier() {
    return -1
  },

  commanderEffect: {
    timing: 'combat-modifier',
    apply: (_player, _context) => {
      return 1
    },
  },
}
