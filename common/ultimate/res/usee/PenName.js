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
    (game, player) => {
      const choices = []

      const unsplayed = game
        .utilColors()
        .filter(c => c !== 'purple')
        .map(c => game.getZoneByPlayer(player, c))
        .filter(z => z.splay === 'none')
        .map(z => z.color)

      if (unsplayed.length > 0) {
        choices.push({
          title: 'Splay left and self-execute',
          choices: unsplayed,
          min: 0,
          max: 1,
        })
      }

      const handCards = game.getCardsByZone(player, 'hand')

      if (handCards.length > 0) {
        choices.push({
          title: 'Meld and splay right',
          choices: handCards.map(c => c.name),
          min: 0,
          max: 1,
        })
      }

      const selected = game.actions.choose(player, choices, { title: 'Choose one:' })[0]

      if (selected.title === 'Splay left and self-execute') {
        const color = selected.selection[0]
        game.aSplay(player, color, 'left')
        const topCard = game.getTopCard(player, color)
        if (topCard) {
          game.aSelfExecute(player, topCard)
        }
      }
      else if (selected.title === 'Meld and splay right') {
        const card = game.cards.byId(selected.selection[0])
        game.aMeld(player, card)
        game.aSplay(player, card.color, 'right')
      }
    },
  ],
}
