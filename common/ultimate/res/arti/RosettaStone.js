module.exports = {
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
      const expChoices = game.getExpansionList().map(e =>
        game.actions.option({ id: e, title: e, kind: 'expansion' })
      )
      const expSelection = game.actions.choose(player, expChoices, { title: 'Choose a card type' })
      // Original code returned the full selection array; keep that shape so
      // downstream draw({ exp }) behaves identically (legacy duck typing).
      const exp = expSelection.map(s => (s && typeof s === 'object') ? s.id : s)
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
