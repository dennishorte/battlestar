const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Teleprompter`  // Card names are unique in Innovation
  this.name = `Teleprompter`
  this.color = `green`
  this.age = 9
  this.expansion = `usee` // corrected expansion
  this.biscuits = `liih`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = []
  this.dogma = [
    //    `Reveal the top card of any value deck from any set. Execute the first sentence of non-demand dogma effect on the card. If you do, return the revealed card and repeat this effect using the next sentence.`
    `Reveal the top card of any value deck from any set. Execute the first non-demand dogma effect on the card. If the revealed card has a {c}, repeat this effect with a different deck.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const checkHasDemand = (text) => {
        const lower = text.toLowerCase()
        return lower.startsWith('i demand') || lower.startsWith('i compel')
      }

      const used = []

      while (true) {
        // Prompt player to choose an age (value) deck
        const exp = game.aChoose(player, game.getExpansionList())[0]
        const age = game.aChooseAge(player)

        const key = `${exp}-${age}`
        if (used.includes(key)) {
          game.mLog({ template: 'You have already chosen that deck.' })
          continue
        }

        used.push(key)

        // Reveal the top card of the chosen deck
        const card = game.getZoneByDeck(exp, age).cards()[0]
        if (!card) {
          game.mLogNoEffect()
          return
        }

        game.mReveal(player, card)

        for (let i = 0; i < card.dogma.length; i++) {
          if (checkHasDemand(card.dogma[i])) {
            continue
          }

          game.aOneEffect(
            player,
            card,
            card.dogma[i],
            card.dogmaImpl[i],
          )
          break
        }

        if (card.checkHasBiscuit('c')) {
          continue
        }
        else {
          break
        }
      }
    },
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
