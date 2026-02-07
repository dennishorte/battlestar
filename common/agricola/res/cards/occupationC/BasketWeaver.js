module.exports = {
  id: "basket-weaver-c095",
  name: "Basket Weaver",
  deck: "occupationC",
  number: 95,
  type: "occupation",
  players: "1+",
  text: "When you play this card, immediately build the \"Basketmaker's Workshop\" major improvement for 1 stone and 1 reed.",
  onPlay(game, player) {
    if (player.stone >= 1 && player.reed >= 1) {
      game.actions.buildMajorImprovement(player, 'basketmakers-workshop', { stone: 1, reed: 1 })
    }
  },
}
