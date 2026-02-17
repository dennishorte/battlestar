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
        'Convert 1 grain to 3 food',
        'Convert 1 grain to 1 bonus point',
        'Skip',
      ], { title: 'Home Brewer', min: 1, max: 1 })
      if (selection[0] === 'Convert 1 grain to 3 food') {
        player.payCost({ grain: 1 })
        player.addResource('food', 3)
        game.log.add({
          template: '{player} converts 1 grain to 3 food via Home Brewer',
          args: { player },
        })
      }
      else if (selection[0] === 'Convert 1 grain to 1 bonus point') {
        player.payCost({ grain: 1 })
        player.addBonusPoints(1)
        game.log.add({
          template: '{player} converts 1 grain to 1 BP via Home Brewer',
          args: { player },
        })
      }
    }
  },
}
