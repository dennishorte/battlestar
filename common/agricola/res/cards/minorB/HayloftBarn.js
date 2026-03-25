module.exports = {
  id: "hayloft-barn-b021",
  name: "Hayloft Barn",
  deck: "minorB",
  number: 21,
  type: "minor",
  cost: { wood: 3 },
  prereqs: { occupations: 1 },
  category: "Food Provider",
  text: "Place 4 food on this card. Each time you obtain at least 1 grain, you also get 1 food from this card. Once it is empty, you get a \"Family Growth Even without Room\" action.",
  storedResource: "food",
  onPlay(game, player) {
    game.cardState(this.id).stored = 4
    game.log.add({
      template: '{player} places 4 food on Hayloft Barn',
      args: { player },
    })
  },
  _obtainGrain(game, player) {
    const state = game.cardState(this.id)
    if (state.stored > 0) {
      state.stored--
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food ({remaining} remaining)',
        args: { player, remaining: state.stored },
      })
      if (state.stored === 0) {
        game.actions.familyGrowthWithoutRoom(player, { fromCard: true })
      }
    }
  },
  onGainGrain(game, player) {
    this._obtainGrain(game, player)
  },
  onHarvestGrain(game, player) {
    this._obtainGrain(game, player)
  },
}
