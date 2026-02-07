module.exports = {
  id: "lazybones-e148",
  name: "Lazybones",
  deck: "occupationE",
  number: 148,
  type: "occupation",
  players: "1+",
  text: "Place (up to) 1 stable each on \"Grain Seeds\", \"Farmland\", \"Day Laborer\", and \"Farm Expansion\". Build the stable at no cost when another player uses that action space.",
  onPlay(_game, _player) {
    this.stables = {
      'take-grain': true,
      'plow-field': true,
      'day-laborer': true,
      'build-rooms': true,
    }
  },
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actingPlayer.name !== cardOwner.name && this.stables && this.stables[actionId]) {
      delete this.stables[actionId]
      game.actions.buildFreeStable(cardOwner, this)
    }
  },
}
