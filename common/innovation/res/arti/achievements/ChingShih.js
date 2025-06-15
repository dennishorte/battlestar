const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = `Ching Shih`  // Card names are unique in Innovation
  this.name = `Ching Shih`
  this.shortName = 'shih'
  this.color = `red`
  this.age = 6
  this.expansion = `arti`
  this.biscuits = `iihl`
  this.dogmaBiscuit = `i`
  this.isSpecialAchievement = true
  this.isRelic = true
  this.inspire = ``
  this.echo = ``
  this.karma = [
    // `When you meld this card, transfer an achievement from an opponent's achievements to yours.`,
    `When you meld this card from your hand, transfer an achievement from an opponent's achievements to yours.`,
    `If you would score a non-figure, instead transfer a card of the same value from an opponent's score pile to yours.`,
  ]
  this.dogma = []
  this.relicExpansion = 'figs'

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'when-meld',
      matches: (game, player, { fromZone }) => {
        return fromZone === game.getZoneByPlayer(player, 'hand').id
      },
      func(game, player) {
        const choices = game
          .players.opponentsOf(player)
          .flatMap(opp => game
            .getCardsByZone(opp, 'achievements')
            .map(ach => ({ opp, ach }))
          )
          .map(({ opp, ach }) => {
            let achString
            if (ach.isSpecialAchievement) {
              achString = ach.name
            }
            else {
              achString = `age ${ach.getAge()}`
            }
            return `${opp.name}, ${achString}`
          })

        const toTransfer = game.actions.choose(player, choices, { title: 'Choose an Achievement' })
        if (toTransfer && toTransfer.length > 0) {
          const tokens = toTransfer[0].split(', ')
          const playerName = tokens[0]
          const cardToken = tokens.slice(1).join(', ')


          let card
          if (cardToken.startsWith('age ')) {
            const target = game.players.byName(playerName)
            const age = parseInt(cardToken.split(' ')[1])
            card = game
              .getCardsByZone(target, 'achievements')
              .find(card => card.getAge() === age && !card.isSpecialAchievement)
          }
          else {
            card = game.getCardByName(cardToken)
          }

          game.aTransfer(player, card, game.getZoneByPlayer(player, 'achievements'))
        }
      }
    },

    {
      trigger: 'score',
      kind: 'would-instead',
      matches: (game, player, { card }) => !card.checkIsFigure(),
      func: (game, player, { card }) => {
        const choices = game
          .players.opponentsOf(player)
          .filter(opp => game.getCardsByZone(opp, 'score').find(c => c.getAge() === card.getAge()))

        const opp = game.aChoosePlayer(player, choices, { title: 'Choose a player to steal a score card from.' })
        if (opp) {
          const toTransfer = game
            .getCardsByZone(opp, 'score')
            .find(c => c.getAge() === card.getAge())
          game.aTransfer(player, toTransfer, game.getZoneByPlayer(player, 'score'))
        }
      }
    }
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
