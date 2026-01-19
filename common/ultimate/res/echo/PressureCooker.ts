export default {
  name: `Pressure Cooker`,
  color: `yellow`,
  age: 5,
  expansion: `echo`,
  biscuits: `5hss`,
  dogmaBiscuit: `s`,
  echo: ``,
  dogma: [
    `If Pressure Cooker was foreseen, meld all cards from your hand.`,
    `Return all cards from your hand. For each top card on your board with a bonus, draw a card and junk an available achievement of value equal to that bonus.`
  ],
  dogmaImpl: [
    (game, player, { foreseen, self }) => {
      game.log.addForeseen(foreseen, self)

      if (foreseen) {
        game.actions.meldMany(player, game.cards.byPlayer(player, 'hand'))
      }
    },

    (game, player) => {
      game.actions.returnMany(player, game.cards.byPlayer(player, 'hand'))

      const toDraw = game
        .cards
        .tops(player)
        .filter(card => card.checkHasBonus())
        .map(card => card.getBonuses()[0])
        .sort()

      while (toDraw.length > 0) {
        const age = game.actions.chooseAge(player, toDraw)
        game.actions.draw(player, { age })
        game.actions.junkAvailableAchievement(player, [age])
        toDraw.splice(toDraw.indexOf(age), 1)
      }
    }
  ],
  echoImpl: [],
}
