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
      const imp = game.cards.byId('basketmakers-workshop')
      if (imp && !player.majorImprovements.includes('basketmakers-workshop')) {
        player.payCost({ stone: 1, reed: 1 })
        imp.moveTo(player.zones.byPlayer(player, 'majorImprovements'))
        game.log.add({
          template: "{player} builds Basketmaker's Workshop for 1 stone and 1 reed via Basket Weaver",
          args: { player },
        })
        if (imp.hasHook('onBuy')) {
          imp.callHook('onBuy', game, player)
        }
      }
    }
  },
}
