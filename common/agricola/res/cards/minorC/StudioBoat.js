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
  onAction(game, player, actionId) {
    if (actionId === 'traveling-players') {
      player.addBonusPoints(1)
      game.log.add({
        template: '{player} gets 1 bonus point from Studio Boat',
        args: { player },
      })
    }
  },
}
