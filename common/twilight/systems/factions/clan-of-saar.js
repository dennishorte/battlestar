module.exports = {
  onPlanetGained(player, ctx) {
    player.addTradeGoods(1)
    ctx.log.add({
      template: '{player} gains 1 trade good (Scavenge)',
      args: { player },
    })
  },
}
