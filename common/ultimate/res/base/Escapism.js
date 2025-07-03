module.exports = {
  name: `Escapism`,
  color: `purple`,
  age: 11,
  expansion: `base`,
  biscuits: `pphp`,
  dogmaBiscuit: `p`,
  dogma: [
    `Reveal and junk a card in your hand. Return from your hand all cards of value equal to the value of the junked card. Draw three cards of that value. Self-execute the junked card.`
  ],
  dogmaImpl: [
    (game, player) => {
      const hand = game.getZoneByPlayer(player, 'hand').cards()
      if (hand.length === 0) {
        game.log.addNoEffect()
        return
      }

      const card = game.actions.chooseCard(player, hand)
      if (card) {
        game.mReveal(player, card)
        game.aJunk(player, card)

        const cardValue = card.getAge()
        game.log.add({
          template: '{player} will return all cards of value {value} from hand',
          args: { player, value: cardValue }
        })

        const toReturn = hand
          .filter(c => c.getAge() === cardValue)
          .filter(c => c.name !== card.name)
        game.aReturnMany(player, toReturn, { ordered: true })

        for (let i = 0; i < 3; i++) {
          game.aDraw(player, { age: cardValue })
        }

        game.aSelfExecute(player, card)
      }
    }
  ],
}
