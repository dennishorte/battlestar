module.exports = {
  id: "bonehead-d118",
  name: "Bonehead",
  deck: "occupationD",
  number: 118,
  type: "occupation",
  players: "1+",
  text: "When you play this card, immediately place 6 wood on it. Immediately after each time you play a card from your hand, including this one, you get 1 wood from this card.",
  onPlay(game, player) {
    this.wood = 6
    if (this.wood > 0) {
      this.wood--
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from Bonehead',
        args: { player },
      })
    }
  },
  onPlayCard(game, player) {
    if ((this.wood || 0) > 0) {
      this.wood--
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from Bonehead',
        args: { player },
      })
    }
  },
}
