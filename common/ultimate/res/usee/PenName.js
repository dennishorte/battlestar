module.exports = {
  name: `Pen Name`,
  color: `purple`,
  age: 5,
  expansion: `usee`,
  biscuits: `fhfs`,
  dogmaBiscuit: `f`,
  dogma: [
    `Choose to either splay an unsplayed non-purple color on your board left and self-execute its top card, or meld a card from your hand and splay its color on your board right.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const choices = []

      const unsplayed = game
        .util.colors()
        .filter(c => c !== 'purple')
        .map(c => game.zones.byPlayer(player, c))
        .filter(z => z.splay === 'none')
        .map(z => z.color)

      if (unsplayed.length > 0) {
        choices.push({
          title: 'Splay left and self-execute',
          id: 'splay-left',
          choices: unsplayed.map(c => game.actions.option({ id: c, title: c, kind: 'color' })),
          min: 0,
          max: 1,
        })
      }

      const handCards = game.cards.byPlayer(player, 'hand')

      if (handCards.length > 0) {
        choices.push({
          title: 'Meld and splay right',
          id: 'meld-splay-right',
          choices: handCards.map(c => game.actions.cardOption(c)),
          min: 0,
          max: 1,
        })
      }

      const selected = game.actions.choose(player, choices, { title: 'Choose one:' })[0]
      const selectedId = selected.id ?? selected.title
      const inner = selected.selection[0]
      const innerId = (inner && typeof inner === 'object') ? inner.id : inner

      if (selectedId === 'splay-left' || selectedId === 'Splay left and self-execute') {
        const color = innerId
        game.actions.splay(player, color, 'left')
        const topCard = game.cards.top(player, color)
        if (topCard) {
          game.actions.selfExecute(self, player, topCard)
        }
      }
      else if (selectedId === 'meld-splay-right' || selectedId === 'Meld and splay right') {
        const card = game.cards.byId(innerId)
        game.actions.meld(player, card)
        game.actions.splay(player, card.color, 'right')
      }
    },
  ],
}
