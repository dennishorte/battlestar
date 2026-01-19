export default {
  name: `Rosetta Stone`,
  color: `blue`,
  age: 2,
  expansion: `arti`,
  biscuits: `kkkh`,
  dogmaBiscuit: `k`,
  dogma: [
    `Choose a set. Draw two {2} from that set. Meld one and transfer the other to an opponent's board.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const exp = game.actions.choose(player, game.getExpansionList(), { title: 'Choose a card type' })
      const cards = [
        game.actions.draw(player, { age: game.getEffectAge(self, 2), exp }),
        game.actions.draw(player, { age: game.getEffectAge(self, 2), exp }),
      ].filter(card => card !== undefined)

      const card = game.actions.chooseCard(player, cards, { title: 'Choose a card to meld' })
      game.actions.meld(player, card)

      const otherCard = cards.filter(other => other !== card)[0]
      if (otherCard) {
        const opponent = game.actions.choosePlayer(player, game.players.opponents(player))
        game.actions.transfer(player, otherCard, game.zones.byPlayer(opponent, otherCard.color))
      }
    }
  ],
}
