module.exports = {
  name: `Hudson's Bay Company Archives`,
  color: `green`,
  age: 5,
  expansion: `arti`,
  biscuits: `chfc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Score the bottom card of every color on your board. Meld a card from your score pile. Splay right the color of the melded card. Junk all cards of value equal to the melded card.`
  ],
  dogmaImpl: [
    (game, player) => {
      const toScore = game
        .util.colors()
        .flatMap(color => game.cards.byPlayer(player, color).slice(-1))
      game.actions.scoreMany(player, toScore)

      const card = game.actions.chooseAndMeld(player, game.cards.byPlayer(player, 'score'))[0]
      if (card) {
        game.actions.splay(player, card.color, 'right')
        game.actions.junkDeck(player, card.getAge())
      }
    }
  ],
}
