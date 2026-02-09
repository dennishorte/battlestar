module.exports = {
  id: "seed-trader-d114",
  name: "Seed Trader",
  deck: "occupationD",
  number: 114,
  type: "occupation",
  players: "1+",
  text: "Place 2 grain and 2 vegetables on this card. You can buy them at any time. Each grain costs 2 food; each vegetable costs 3 food.",
  allowsAnytimeAction: true,
  onPlay(_game, _player) {
    this.grain = 2
    this.vegetables = 2
  },
  canBuyGrain() {
    return (this.grain || 0) > 0
  },
  canBuyVegetable() {
    return (this.vegetables || 0) > 0
  },
  buyGrain(game, player) {
    if (player.food >= 2 && this.grain > 0) {
      player.payCost({ food: 2 })
      player.addResource('grain', 1)
      this.grain--
      game.log.add({
        template: '{player} buys 1 grain from Seed Trader',
        args: { player },
      })
    }
  },
  buyVegetable(game, player) {
    if (player.food >= 3 && this.vegetables > 0) {
      player.payCost({ food: 3 })
      player.addResource('vegetables', 1)
      this.vegetables--
      game.log.add({
        template: '{player} buys 1 vegetable from Seed Trader',
        args: { player },
      })
    }
  },
}
