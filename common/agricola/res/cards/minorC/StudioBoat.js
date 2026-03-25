module.exports = {
  id: "studio-boat-c039",
  name: "Studio Boat",
  deck: "minorC",
  number: 39,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { occupations: 1 },
  category: "Points Provider",
  text: "Each time you use the \"Traveling Players\" accumulation space, you also get 1 bonus point. In games with 1-3 players, this card is considered \"Traveling Players\" (same effect as \"Fishing\").",
  providesActionSpace: true,
  actionSpaceId: "studio-boat",
  actionSpaceForPlayerCount: [1, 2, 3],
  matches_onAction(game, player, actionId) {
    return actionId === 'traveling-players' || actionId === 'traveling-players-5'
  },
  onAction(game, player, _actionId) {
    player.addBonusPoints(1)
    game.log.add({
      template: '{player} gets 1 bonus point',
      args: { player },
    })
  },
}
