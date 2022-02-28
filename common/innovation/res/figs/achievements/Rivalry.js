const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Rivalry'
  this.name = 'Rivalry'
  this.exp = 'figs'
  this.text = 'Choose another player. Return three cards from their score pile, and all their top figures.'
  this.alt = ''
  this.isSpecialAchievement = true
  this.decreeImpl = (game, player) => {
    // Choose a player
    const otherPlayers = game
      .getPlayerAll()
      .filter(p => p.name !== player.name)
      .map(p => p.name)
    const other = game.aChoosePlayer(player, otherPlayers)

    // Choose three cards
    const scoreCards = game
      .getZoneByPlayer(other, 'score')
      .cards()
      .map(c => c.id)
    const cardNames = game.requestInputSingle({
      actor: player.name,
      title: 'Choose Three Cards',
      choices: scoreCards,
      count: 3,
    })

    // Return chosen cards
    const cards = cardNames.map(c => game.getCardByName(c))
    game.aReturnMany(player, cards)

    // Return top figures
    const topFigures = game
      .getTopCards(other)
      .filter(c => c.expansion === 'figs')
    game.aReturnMany(player, topFigures)
  }
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
