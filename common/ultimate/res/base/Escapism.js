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
      const hand = game.zones.byPlayer(player, 'hand').cards()
      if (hand.length === 0) {
        game.log.addNoEffect()
        return
      }

      const card = game.actions.chooseCard(player, hand)
      if (card) {
        game.actions.reveal(player, card)
        game.actions.junk(player, card)

        const cardValue = card.getAge()
        game.log.add({
          template: '{player} will return all cards of value {value} from hand',
          args: { player, value: cardValue }
        })

        const toReturn = hand
          .filter(c => c.getAge() === cardValue)
          .filter(c => c.name !== card.name)
        game.actions.returnMany(player, toReturn, { ordered: true })

        for (let i = 0; i < 3; i++) {
          game.actions.draw(player, { age: cardValue })
        }

        game.aSelfExecute(player, card)
      }
    }
  ],
}
