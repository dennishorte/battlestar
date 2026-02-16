module.exports = {
  id: "bonehead-d118",
  name: "Bonehead",
  deck: "occupationD",
  number: 118,
  type: "occupation",
  players: "1+",
  text: "When you play this card, immediately place 6 wood on it. Immediately after each time you play a card from your hand, including this one, you get 1 wood from this card.",
  onPlay(game, player) {
    const s = game.cardState(this.id)
    s.wood = 6
    // Give 1 wood for playing this card itself
    this._giveWood(game, player)
  },
  onPlayOccupation(game, player) {
    this._giveWood(game, player)
  },
  onBuildImprovement(game, player) {
    this._giveWood(game, player)
  },
  _giveWood(game, player) {
    const s = game.cardState(this.id)
    if ((s.wood || 0) > 0) {
      s.wood--
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from Bonehead ({remaining} left)',
        args: { player, remaining: s.wood },
      })
    }
  },
}
