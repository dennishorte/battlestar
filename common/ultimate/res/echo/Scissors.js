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
        if (game.getCardsByZone(player, 'hand').length === 0) {
          break
        }

        const card = game.aChooseCard(player, game.getCardsByZone(player, 'hand'), {
          title: `Choose a card to score or meld (${i + 1} of 2)`,
          min: 0,
          max: 1
        })

        if (card) {
          const meldOrScore = game.aChoose(player, ['meld', 'score'], {
            title: `Meld or score ${card.name}`
          })[0]
          if (meldOrScore === 'meld') {
            game.aMeld(player, card)
          }
          else {
            game.aScore(player, card)
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
        .getPlayerAll()
        .flatMap(player => game.getTopCards(player))
        .filter(card => card.name === 'Paper')

      if (paper.length > 0) {
        game.aScore(player, paper[0])
      }
    },
  ],
  echoImpl: [
    (game, player) => {
      const card = game.getBottomCard(player, 'yellow')
      if (card) {
        game.aScore(player, card)
      }
    }
  ],
}
