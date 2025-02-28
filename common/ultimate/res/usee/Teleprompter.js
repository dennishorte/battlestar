const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Teleprompter`  // Card names are unique in Innovation
  this.name = `Teleprompter`
  this.color = `green`
  this.age = 9
  this.expansion = `base` // corrected expansion
  this.biscuits = `liih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Reveal the top card of any value deck from any set. Execute the first sentence of non-demand dogma effect on the card. If you do, return the revealed card and repeat this effect using the next sentence.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      while (true) {
        // Prompt player to choose an age (value) deck
        const age = game.aChooseAge(player)
        const deck = game.aChooseDeck(player, age)
        
        // Reveal the top card of the chosen deck
        const card = game.aRevealTopCard(deck)
        const dogmaText = card.dogma[0]

        // Extract first sentence of dogma text
        const firstSentence = dogmaText.split('.')[0] + '.'

        game.mLog({
          template: 'Executing first sentence of {card}: "{text}"',
          args: { card, text: firstSentence }
        })

        // Execute the first sentence dogma effect
        game.aCardEffectByText(player, card, firstSentence)

        // Return the revealed card
        game.mMoveCardTo(card, deck)

        // Extract the second sentence, if any
        const sentences = dogmaText.split('.')
        if (sentences.length > 1 && sentences[1].trim()) {
          const secondSentence = sentences[1].trim()
          
          game.mLog({
            template: 'Executing next sentence: "{text}"',
            args: { text: secondSentence }
          })

          // Execute the second sentence dogma effect  
          game.aCardEffectByText(player, card, secondSentence)
        }
        else {
          // No more sentences, end the loop
          break
        }
      }
    },
  ]
  this.echoImpl = []
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