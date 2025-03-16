const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')
const util = require('../../../lib/util.js')


function Card() {
  this.id = `Dancing Girl`  // Card names are unique in Innovation
  this.name = `Dancing Girl`
  this.color = `yellow`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `hsss`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to transfer Dancing Girl to your board! If you do, transfer all of your highest top cards to my board!`,
    // `I compel you to transfer Dancing Girl to your board!`,
    // `If Dancing Girl has been on every board during this action, and it started on your board, you win.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const self = game.getCardByName('Dancing Girl')
      game.aTransfer(player, self, game.getZoneByPlayer(player, self.color))

      const age = game.getHighestTopAge(player)
      const toTransfer = game
        .getTopCards(player)
        .filter(card => card.getAge() == age)

      while (toTransfer.length > 0) {
        const card = game.aChooseCard(player, toTransfer, {
          title: `Choose a card to transfer to ${leader.name}`,
        })

        game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
        util.array.remove(toTransfer, card)
      }
    }

    /* (game, player) => {
     *   if (!game.state.dogmaInfo.dancingGirl) {
     *     game.state.dogmaInfo.dancingGirl = {}
     *     game.state.dogmaInfo.dancingGirl.zones = []
     *     game.state.dogmaInfo.dancingGirl.startingZone = this.zone
     *   }

     *   game.aTransfer(player, this, game.getZoneByPlayer(player, this.color))
     *   game.state.dogmaInfo.dancingGirl.zones.push(this.zone) // Zone after transfer
     * },

     * (game, player, { leader }) => {
     *   if (player !== leader) {
     *     game.mLogNoEffect()
     *     return
     *   }

     *   const info = game.state.dogmaInfo.dancingGirl
     *   const startingCondition = info.startingZone === `players.${player.name}.yellow`
     *   const travelCondition = info.zones.length === game.getPlayerAll().length - 1

     *   if (startingCondition && travelCondition) {
     *     throw new GameOverEvent({
     *       player,
     *       reason: this.name
     *     })
     *   }
     *   else {
     *     game.mLogNoEffect()
     *   }
     * } */
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
