module.exports = {
  id: "mud-wallower-c148",
  name: "Mud Wallower",
  deck: "occupationC",
  number: 148,
  type: "occupation",
  players: "4+",
  text: "Each time you use an accumulation space, place 1 clay from the general supply on this card. You must immediately exchange 4 clay on this card for 1 wild boar, held by this card.",
  holdsAnimals: { boar: true },
  onPlay(game, _player) {
    const s = game.cardState(this.id)
    s.clay = 0
  },
  matches_onAction(game, player, actionId) {
    return game.isAccumulationSpace(actionId)
  },
  onAction(game, player, _actionId) {
    const s = game.cardState(this.id)
    s.clay = (s.clay || 0) + 1
    while (s.clay >= 4) {
      s.clay -= 4
      player.addCardAnimal(this.id, 'boar', 1)
      game.log.add({
        template: '{player} gets 1 wild boar on {card}',
        args: { player, card: this },
      })
    }
  },
  // Capacity equals the boar currently on the card: prevents adding any new
  // animals (including via breeding overflow or manual moves), so removed
  // boar can never go back on. Boar are added directly via addCardAnimal
  // when the trigger fires.
  getAnimalCapacity(game, player) {
    return player.getCardAnimals(this.id).boar || 0
  },
}
