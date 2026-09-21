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
    (game, player, { self }) => {
      const hand = game.zones.byPlayer(player, 'hand').cardlist()
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

        game.actions.returnMany(player, hand, {
          ordered: true,
          filter: c => c.getAge() === cardValue && c.name !== card.name,
        })

        for (let i = 0; i < 3; i++) {
          game.actions.draw(player, { age: cardValue })
        }

        game.actions.selfExecute(self, player, card)
      }
    }
  ],
}
