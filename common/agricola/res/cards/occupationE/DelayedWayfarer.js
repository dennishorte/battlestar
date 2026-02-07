module.exports = {
  id: "delayed-wayfarer-e125",
  name: "Delayed Wayfarer",
  deck: "occupationE",
  number: 125,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 building resource of your choice and, once all people have been placed this round, you can place a person from your supply.",
  onPlay(game, player) {
    game.actions.offerBuildingResourceChoice(player, this)
    player.delayedWayfarerPending = true
  },
  onAllPeoplePlaced(game, player) {
    if (player.delayedWayfarerPending && player.hasPersonInSupply()) {
      game.actions.offerPlacePersonFromSupply(player, this)
      player.delayedWayfarerPending = false
    }
  },
}
