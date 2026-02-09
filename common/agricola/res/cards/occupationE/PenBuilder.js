module.exports = {
  id: "pen-builder-e086",
  name: "Pen Builder",
  deck: "occupationE",
  number: 86,
  type: "occupation",
  players: "1+",
  text: "At any time, you can place wood from your supply on this card, irretrievably. You can keep twice as many animals of any type on this card as there is wood on it.",
  allowsAnytimeAction: true,
  mixedAnimals: true,
  holdsAnimals: { any: true },
  onPlay(_game, _player) {
    this.wood = 0
  },
  canPlaceWood(player) {
    return player.wood >= 1
  },
  placeWood(game, player, amount) {
    player.payCost({ wood: amount })
    this.wood = (this.wood || 0) + amount
    game.log.add({
      template: '{player} places {amount} wood on Pen Builder',
      args: { player, amount },
    })
  },
  getAnimalCapacity() {
    return (this.wood || 0) * 2
  },
}
