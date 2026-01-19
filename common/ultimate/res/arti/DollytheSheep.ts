export default {
  name: `Dolly the Sheep`,
  color: `yellow`,
  age: 10,
  expansion: `arti`,
  biscuits: `hili`,
  dogmaBiscuit: `i`,
  dogma: [
    `You may score your bottom yellow card. You may draw and tuck a {1}. If your bottom yellow card is Domestication, you win. Otherwise, meld the higest card in your hand, then draw an {e}.`,
    `Junk all available achievements.`,
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      // You may score your bottom yellow card.
      const yellowCards = game.cards.byPlayer(player, 'yellow')
      if (yellowCards.length === 0) {
        game.log.add({
          template: '{player} has no yellow cards',
          args: { player },
        })
      }
      else {
        const doScoreYellow = game.actions.chooseYesNo(player, 'Score your bottom yellow card?')
        if (doScoreYellow) {
          game.actions.score(player, yellowCards[yellowCards.length - 1])
        }
        else {
          game.log.add({
            template: '{player} chooses not to score their bottom yellow card.',
            args: { player }
          })
        }
      }

      // You may draw and tuck a 1.
      const age = game.getEffectAge(self, 1)
      const doDrawAndTuck = game.actions.chooseYesNo(player, `Draw and tuck a {${age}}?`)
      if (doDrawAndTuck) {
        game.actions.drawAndTuck(player, age)
      }

      // You win if your bottom yellow card is domestication.
      const newYellowCards = game.cards.byPlayer(player, 'yellow')
      if (newYellowCards.length > 0 && newYellowCards[newYellowCards.length - 1].name === 'Domestication') {
        game.youWin(player, self.name)
      }

      // Otherwise, meld the highest card in your hand and draw a 10.
      else {
        const cards = game.actions.chooseHighest(player, game.cards.byPlayer(player, 'hand'), 1)
        if (cards && cards.length > 0) {
          game.actions.meld(player, cards[0])
        }

        game.actions.draw(player, { age: game.getEffectAge(self, 11) })
      }
    },

    (game, player) => {
      game.actions.junkMany(player, game.getAvailableAchievements(player))
    }
  ],
}
