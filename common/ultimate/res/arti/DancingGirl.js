const util = require('../../../lib/util.js')

module.exports = {
  name: `Dancing Girl`,
  color: `yellow`,
  age: 1,
  expansion: `arti`,
  biscuits: `hsss`,
  dogmaBiscuit: `s`,
  dogma: [
    `I compel you to transfer Dancing Girl to your board! If you do, transfer all of your highest top cards to my board!`,
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const self = game.getCardByName('Dancing Girl')
      game.actions.transfer(player, self, game.getZoneByPlayer(player, self.color))

      const age = game.getHighestTopAge(player)
      const toTransfer = game
        .getTopCards(player)
        .filter(card => card.getAge() == age)

      while (toTransfer.length > 0) {
        const card = game.actions.chooseCard(player, toTransfer, {
          title: `Choose a card to transfer to ${leader.name}`,
        })

        game.actions.transfer(player, card, game.getZoneByPlayer(leader, card.color))
        util.array.remove(toTransfer, card)
      }
    }
  ],
}
