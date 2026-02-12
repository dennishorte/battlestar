module.exports = {
  id: "tasting-b063",
  name: "Tasting",
  deck: "minorB",
  number: 63,
  type: "minor",
  cost: { wood: 2 },
  vps: 1,
  category: "Food Provider",
  text: "Each time you use a \"Lessons\" action space, before you pay the occupation cost, you can exchange 1 grain for 4 food.",
  onLessons(game, player) {
    if (player.grain < 1) {
      return
    }

    const selection = game.actions.choose(player, [
      'Exchange 1 grain for 4 food',
      'Do not exchange',
    ], {
      title: 'Tasting',
      min: 1,
      max: 1,
    })

    if (selection[0] === 'Exchange 1 grain for 4 food') {
      player.removeResource('grain', 1)
      player.addResource('food', 4)
      game.log.add({
        template: '{player} exchanges 1 grain for 4 food (Tasting)',
        args: { player },
      })
    }
  },
}
