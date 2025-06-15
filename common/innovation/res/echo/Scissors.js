const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Scissors`  // Card names are unique in Innovation
  this.name = `Scissors`
  this.color = `green`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `&h2k`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = `Take a bottom card from your board into your hand.`
  this.karma = []
  this.dogma = [
    `You may choose up to two cards from your hand. For each card chosen, either meld it or score it.`,
    `If Paper is a top card on any player's board, transfer it to your score pile.`
  ]

  this.dogmaImpl = [
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
          const meldOrScore = game.actions.choose(player, ['meld', 'score'], {
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
          game.log.addDoNothing(player)
          break
        }
      }
    },

    (game, player) => {
      const paper = game
        .players.all()
        .flatMap(player => game.getTopCards(player))
        .filter(card => card.name === 'Paper')

      if (paper.length > 0) {
        game.aTransfer(player, paper[0], game.getZoneByPlayer(player, 'score'))
      }
    },
  ]
  this.echoImpl = (game, player) => {
    const choices = game
      .utilColors()
      .map(color => game.getBottomCard(player, color))
      .filter(card => card !== undefined)

    const card = game.aChooseCard(player, choices)

    if (card) {
      game.mMoveCardTo(card, game.getZoneByPlayer(player, 'hand'), { player })
    }
  }
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
