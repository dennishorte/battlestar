module.exports = {
  id: "grocer-a102",
  name: "Grocer",
  deck: "occupationA",
  number: 102,
  type: "occupation",
  players: "1+",
  text: "Pile the following goods on this card (wood, grain, reed, stone, vegetable, clay, reed, vegetable). At any time, you can buy the top good for 1 food.",
  allowsAnytimePurchase: true,
  onPlay(game, player) {
    player.grocerGoods = ['wood', 'grain', 'reed', 'stone', 'vegetables', 'clay', 'reed', 'vegetables']
  },
}
