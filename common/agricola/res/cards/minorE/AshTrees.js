module.exports = {
  id: "ash-trees-e074",
  name: "Ash Trees",
  deck: "minorE",
  number: 74,
  type: "minor",
  cost: {},
  prereqs: { plantedFields: 2 },
  text: "When you play this card, immediately place (up to) 5 fences from your supply on it. When you build fences, fences taken from this card cost you nothing.",
  onPlay(game, player) {
    const fencesToPlace = Math.min(5, player.fencesRemaining || 0)
    game.cardState(this.id).storedFences = fencesToPlace
    if (fencesToPlace > 0) {
      player.fencesRemaining -= fencesToPlace
      game.log.add({
        template: '{player} places {amount} fences on Ash Trees',
        args: { player, amount: fencesToPlace },
      })
    }
  },
  getFreeFences(game) {
    return game.cardState(this.id).storedFences || 0
  },
}
