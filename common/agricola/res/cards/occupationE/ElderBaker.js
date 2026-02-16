module.exports = {
  id: "elder-baker-e161",
  name: "Elder Baker",
  deck: "occupationE",
  number: 161,
  type: "occupation",
  players: "1+",
  text: "This card is an action space for you only. When you use it, you get 3 grain. You can build the \"Stone Oven\" major improvement even when taking a \"Minor Improvement\" action.",
  providesActionSpace: true,
  actionSpaceId: 'elder-baker-action',
  ownerOnly: true,
  allowsMajorOnMinorAction: true,
  allowedMajors: ["stone-oven"],
  onActionSpaceUsed(game, player, _owner) {
    player.addResource('grain', 3)
    game.log.add({
      template: '{player} gets 3 grain from Elder Baker',
      args: { player },
    })
  },
}
