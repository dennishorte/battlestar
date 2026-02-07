module.exports = {
  id: "shed-builder-e114",
  name: "Shed Builder",
  deck: "occupationE",
  number: 114,
  type: "occupation",
  players: "1+",
  text: "When you build your 1st and 2nd stable, you get 1 grain. When you build your 3rd and 4th stable, you get 1 vegetable. (This does not apply to stables you have already built.)",
  onBuildStable(game, player, stableNumber) {
    if (stableNumber === 1 || stableNumber === 2) {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from Shed Builder',
        args: { player },
      })
    }
    else if (stableNumber === 3 || stableNumber === 4) {
      player.addResource('vegetables', 1)
      game.log.add({
        template: '{player} gets 1 vegetable from Shed Builder',
        args: { player },
      })
    }
  },
}
