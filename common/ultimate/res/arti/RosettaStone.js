module.exports = {
  name: `Rosetta Stone`,
  color: `blue`,
  age: 2,
  expansion: `arti`,
  biscuits: `kkkh`,
  dogmaBiscuit: `k`,
  dogma: [
    `Choose a card type. Draw two {2} of that type. Meld one and transfer the other to an opponent's board.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const exp = game.aChoose(player, game.getExpansionList(), { title: 'Choose a card type' })
      const cards = [
        game.aDraw(player, { age: game.getEffectAge(self, 2), exp }),
        game.aDraw(player, { age: game.getEffectAge(self, 2), exp }),
      ].filter(card => card !== undefined)

      const card = game.aChooseCard(player, cards, { title: 'Choose a card to meld' })
      game.aMeld(player, card)

      const otherCard = cards.filter(other => other !== card)[0]
      if (otherCard) {
        const opponent = game.aChoosePlayer(player, game.getPlayerOpponents(player))
        game.aTransfer(player, otherCard, game.getZoneByPlayer(opponent, otherCard.color))
      }
    }
  ],
}
