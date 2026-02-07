module.exports = {
  id: "guest-room-e022",
  name: "Guest Room",
  deck: "minorE",
  number: 22,
  type: "minor",
  cost: { wood: 4, reed: 1 },
  text: "Immediately place any amount of food from your supply on this card. Once per round, you can discard 1 food from this card to place a person from your supply in that round.",
  enablesGuestWorker: true,
  storedResource: "food",
  onPlay(game, player) {
    game.actions.placeResourcesOnCard(player, this, 'food')
  },
}
