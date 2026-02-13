module.exports = {
  id: "seed-trader-d114",
  name: "Seed Trader",
  deck: "occupationD",
  number: 114,
  type: "occupation",
  players: "1+",
  text: "Place 2 grain and 2 vegetables on this card. You can buy them at any time. Each grain costs 2 food; each vegetable costs 3 food.",
  allowsAnytimeAction: true,
  getAnytimeActions(game, player) {
    const actions = []
    if (this.canBuyGrain(game) && player.food >= 2) {
      actions.push({
        type: 'card-custom',
        cardId: this.id,
        cardName: this.name,
        actionKey: 'buyGrain',
        description: 'Seed Trader: Buy 1 grain for 2 food',
      })
    }
    if (this.canBuyVegetable(game) && player.food >= 3) {
      actions.push({
        type: 'card-custom',
        cardId: this.id,
        cardName: this.name,
        actionKey: 'buyVegetable',
        description: 'Seed Trader: Buy 1 vegetable for 3 food',
      })
    }
    return actions
  },
  onPlay(game, _player) {
    const s = game.cardState(this.id)
    s.grain = 2
    s.vegetables = 2
  },
  canBuyGrain(game) {
    return (game.cardState(this.id).grain || 0) > 0
  },
  canBuyVegetable(game) {
    return (game.cardState(this.id).vegetables || 0) > 0
  },
  buyGrain(game, player) {
    const s = game.cardState(this.id)
    if (player.food >= 2 && s.grain > 0) {
      player.payCost({ food: 2 })
      player.addResource('grain', 1)
      s.grain--
      game.log.add({
        template: '{player} buys 1 grain from Seed Trader',
        args: { player },
      })
    }
  },
  buyVegetable(game, player) {
    const s = game.cardState(this.id)
    if (player.food >= 3 && s.vegetables > 0) {
      player.payCost({ food: 3 })
      player.addResource('vegetables', 1)
      s.vegetables--
      game.log.add({
        template: '{player} buys 1 vegetable from Seed Trader',
        args: { player },
      })
    }
  },
}
