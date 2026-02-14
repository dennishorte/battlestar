module.exports = {
  id: "skimmer-plow-e017",
  name: "Skimmer Plow",
  deck: "minorE",
  number: 17,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { occupations: 2 },
  text: "Each time you use the \"Farmland\" or \"Cultivation\" action space, you can plow 2 fields instead of 1. Each time you sow, you must place 1 fewer good on each field you sow.",
  modifyPlowCount(game, player, count, actionId) {
    if (actionId === 'plow-field' || actionId === 'plow-sow') {
      return count + 1
    }
    return count
  },
  modifySowAmount(game, player, amount) {
    return Math.max(0, amount - 1)
  },
}
