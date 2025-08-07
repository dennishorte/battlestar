module.exports = {
  name: `Propaganda`,
  color: `purple`,
  age: 2,
  expansion: `usee`,
  biscuits: `chkk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I demand you meld a card of the color of my choice from your hand! If you do, transfer the card beneath it to my board!`,
    `Meld a card from your hand.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const chosenColor = game.actions.choose(leader, game.util.colors(), {
        title: 'Choose a color',
        count: 1,
      })[0]

      const choices = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.color === chosenColor)

      if (choices.length === 0) {
        game.log.add({
          template: '{player} does not have a {color} card to meld',
          args: { player, color: chosenColor }
        })
      }
      else {
        const melded = game.actions.chooseAndMeld(player, choices)[0]
        if (melded) {
          const pile = game.zones.byPlayer(player, melded.color)
          const cardBeneath = pile.cardlist()[1]
          if (cardBeneath) {
            game.actions.transfer(player, cardBeneath, game.zones.byPlayer(leader, cardBeneath.color))
          }
          else {
            game.log.add({
              template: 'no card beneath {card} to transfer',
              args: { card: melded }
            })
          }
        }
      }
    },

    (game, player) => {
      game.actions.chooseAndMeld(player, game.cards.byPlayer(player, 'hand'))
    }
  ],
}
