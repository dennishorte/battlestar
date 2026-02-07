module.exports = {
  id: "cow-patty-e071",
  name: "Cow Patty",
  deck: "minorE",
  number: 71,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { cattle: 1 },
  text: "Each time you sow in a field that is orthogonally adjacent to a pasture, you can place 1 additional good of the planted type in it.",
  modifySowAmount(game, player, amount, field) {
    if (player.isFieldAdjacentToPasture(field)) {
      return amount + 1
    }
    return amount
  },
}
