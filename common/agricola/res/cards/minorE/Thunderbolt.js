module.exports = {
  id: "thunderbolt-e004",
  name: "Thunderbolt",
  deck: "minorE",
  number: 4,
  type: "minor",
  cost: {},
  prereqs: { grainFields: 1 },
  text: "Immediately remove all grain from one of your fields to the general supply. Gain 2 wood for each grain you just removed.",
  onPlay(game, player) {
    game.actions.thunderboltExchange(player, this)
  },
}
