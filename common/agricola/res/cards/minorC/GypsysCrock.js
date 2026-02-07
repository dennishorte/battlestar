module.exports = {
  id: "gypsys-crock-c053",
  name: "Gypsy's Crock",
  deck: "minorC",
  number: 53,
  type: "minor",
  cost: { clay: 2 },
  vps: 1,
  category: "Food Provider",
  text: "Each time you use a cooking improvement to turn 2 goods into food at the same time, you get 1 additional food.",
  onCook(game, player, goodsConverted) {
    if (goodsConverted >= 2) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Gypsy\'s Crock',
        args: { player },
      })
    }
  },
}
