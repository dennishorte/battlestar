module.exports = {
  name: `Scissors`,
  color: `green`,
  age: 2,
  expansion: `echo`,
  biscuits: `&h2k`,
  dogmaBiscuit: `k`,
  echo: [`Score your bottom yellow card.`],
  dogma: [
    `You may choose up to two cards from your hand. For each card chosen, either meld it or score it.`,
    `If Paper is a top card on any player's board, score it.`
  ],
  dogmaImpl: [
    (game, player) => {
      for (let i = 0; i < 2; i++) {
        if (game.cards.byPlayer(player, 'hand').length === 0) {
          break
        }

        const card = game.actions.chooseCard(player, game.cards.byPlayer(player, 'hand'), {
          title: `Choose a card to score or meld (${i + 1} of 2)`,
          min: 0,
          max: 1
        })

        if (card) {
          const meldOrScore = game.actions.choose(player, ['meld', 'score'], {
            title: `Meld or score ${card.name}`
          })[0]
          if (meldOrScore === 'meld') {
            game.aMeld(player, card)
          }
          else {
            game.actions.score(player, card)
          }
        }
        else {
          game.mLogDoNothing(player)
          break
        }
      }
    },

    (game, player) => {
      const paper = game
        .players.all()
        .flatMap(player => game.cards.tops(player))
        .filter(card => card.name === 'Paper')

      if (paper.length > 0) {
        game.actions.score(player, paper[0])
      }
    },
  ],
  echoImpl: [
    (game, player) => {
      const card = game.getBottomCard(player, 'yellow')
      if (card) {
        game.actions.score(player, card)
      }
    }
  ],
}
