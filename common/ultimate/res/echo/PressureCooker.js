module.exports = {
  name: `Pressure Cooker`,
  color: `yellow`,
  age: 5,
  expansion: `echo`,
  biscuits: `5hss`,
  dogmaBiscuit: `s`,
  echo: ``,
  dogma: [
    `Return all cards from your hand. For each top card on your board with a bonus, draw a card of value equal to that bonus.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.returnMany(player, game.cards.byPlayer(player, 'hand'))

      const toDraw = game
        .cards.tops(player)
        .filter(card => card.checkHasBonus())
        .map(card => card.getBonuses()[0])
        .sort()

      while (toDraw.length > 0) {
        const age = game.actions.chooseAge(player, toDraw)
        game.actions.draw(player, { age })
        toDraw.splice(toDraw.indexOf(age), 1)
      }
    }
  ],
  echoImpl: [],
}
