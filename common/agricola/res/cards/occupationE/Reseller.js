module.exports = {
  id: "reseller-e146",
  name: "Reseller",
  deck: "occupationE",
  number: 146,
  type: "occupation",
  players: "1+",
  text: "Once this game, immediately after playing or building an improvement, you can choose to get its printed cost from the general supply.",
  onPlay(game, _player) {
    game.cardState(this.id).used = false
  },
  onPlayImprovement(game, player, improvement) {
    if (!game.cardState(this.id).used) {
      game.actions.offerResellerRefund(player, this, improvement)
    }
  },
  onBuildImprovement(game, player, improvement) {
    if (!game.cardState(this.id).used) {
      game.actions.offerResellerRefund(player, this, improvement)
    }
  },
}
