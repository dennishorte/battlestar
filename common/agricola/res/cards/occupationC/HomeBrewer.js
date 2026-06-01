module.exports = {
  id: "home-brewer-c110",
  name: "Home Brewer",
  deck: "occupationC",
  number: 110,
  type: "occupation",
  players: "1+",
  text: "After the field phase of each harvest, you can use this card to turn exactly 1 grain into your choice of 3 food or 1 bonus point.",
  onFieldPhaseEnd(game, player) {
    if (player.grain >= 1) {
      const selection = game.actions.choose(player, () => [
        game.actions.option({ id: 'food', title: 'Convert 1 grain to 3 food' }),
        game.actions.option({ id: 'bonus', title: 'Convert 1 grain to 1 bonus point' }),
        game.actions.option({ id: 'skip', title: 'Skip' }),
      ], { title: 'Home Brewer', min: 1, max: 1 })
      if (selection[0].id === 'food') {
        player.payCost({ grain: 1 })
        player.addResource('food', 3)
        game.log.add({
          template: '{player} converts 1 grain to 3 food',
          args: { player },
        })
      }
      else if (selection[0].id === 'bonus') {
        player.payCost({ grain: 1 })
        player.addBonusPoints(1)
        game.log.add({
          template: '{player} converts 1 grain to 1 BP',
          args: { player },
        })
      }
    }
  },
}
