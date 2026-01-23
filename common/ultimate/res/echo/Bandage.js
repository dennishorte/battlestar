module.exports = {
  name: `Bandage`,
  color: `red`,
  age: 8,
  expansion: `echo`,
  biscuits: `l&hl`,
  dogmaBiscuit: `l`,
  echo: [`Meld a card from your hand with {l}.`],
  dogma: [
    `I demand you return a card with {i} from your score pile! Return a top card with {i} from your board! If you do both, junk an available achievement for each achievement you have!`,
  ],
  dogmaImpl: [
    (game, player) => {
      const scoreOptions = game
        .cards
        .byPlayer(player, 'score')
        .filter(card => card.checkHasBiscuit('i'))
      const fromScore = game.actions.chooseAndJunk(player, scoreOptions)[0]

      const handOptions = game
        .cards
        .byPlayer(player, 'hand')
        .filter(card => card.checkHasBiscuit('i'))
      const fromHand = game.actions.chooseAndJunk(player, handOptions)[0]

      if (fromScore && fromHand) {
        const count = game.cards.byPlayer(player, 'achievements').length
        const availableAchievements = player.availableAchievements()
        game.actions.chooseAndJunk(player, availableAchievements, { count })
      }
    }
  ],
  echoImpl: [
    (game, player) => {
      const choices = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.checkHasBiscuit('l'))
      game.actions.chooseAndMeld(player, choices)
    }
  ],
}
