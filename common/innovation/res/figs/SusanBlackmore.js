const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Susan Blackmore`  // Card names are unique in Innovation
  this.name = `Susan Blackmore`
  this.color = `blue`
  this.age = 10
  this.expansion = `figs`
  this.biscuits = `*shs`
  this.dogmaBiscuit = `s`
  this.inspire = `Execute any other echo or inspire effect.`
  this.echo = ``
  this.karma = [
    `If another player would not draw a share bonus after a Dogma action, first transfer the card they activated to your score pile.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    let choices = []

    for (const player of game.getPlayerAll()) {
      for (const color of game.utilColors()) {
        const zone = game.getZoneByPlayer(player, color)
        const cards = zone.cards()
        for (const card of cards) {
          const echo = game.getVisibleEffects(card, 'echo')
          if (echo) {
            for (const text of echo.texts) {
              choices.push({
                card,
                text,
                kind: 'echo',
              })
            }
          }

          const inspire = game.getVisibleEffects(card, 'inspire')
          if (inspire) {
            for (const text of inspire.texts) {
              choices.push({
                card,
                text,
                kind: 'inspire',
              })
            }
          }
        }
      }
    }

    choices = choices
      .filter(({ card, kind }) => !(card === this && kind === 'inspire'))
      .map(({ card, kind, text }) => {
        return `${card.name}: ${text}`
      })

    const selection = game.aChoose(player, choices)[0]
    if (selection && selection.length > 0) {
      game.mLog({
        template: '{player} choose {effect}',
        args: { player, effect: selection }
      })
      game.mLogIndent()

      const [cardName, text] = selection.split(': ', 2)
      const card = game.getCardByName(cardName)
      const impl = game.getEffectByText(card, text)

      const info = {
        card,
        text,
        impl,
      }
      const opts = {
        biscuits: game.getBiscuits(),
        leader: player,
      }
      game.aCardEffect(player, info, opts)
      game.mLogOutdent()
    }
  }
  this.karmaImpl = [
    {
      trigger: 'no-share',
      triggerAll: true,
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card }) => {
        game.aTransfer(player, card, game.getZoneByPlayer(player, 'score'))
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
