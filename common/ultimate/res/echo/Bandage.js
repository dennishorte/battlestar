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
      const fromScore = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'score'), {
        filter: card => card.checkHasBiscuit('i'),
      })[0]

      const boardOptions = game
        .cards
        .tops(player)
        .filter(card => card.checkHasBiscuit('i'))
      const fromBoard = game.actions.chooseAndReturn(player, boardOptions)[0]

      if (fromScore && fromBoard) {
        const count = game.cards.byPlayer(player, 'achievements').length
        const availableAchievements = player.availableAchievements()
        game.actions.chooseAndJunk(player, availableAchievements, { count })
      }
    }
  ],
  echoImpl: [
    (game, player) => {
      game.actions.chooseAndMeld(player, game.cards.byPlayer(player, 'hand'), {
        filter: card => card.checkHasBiscuit('l'),
      })
    }
  ],
}
