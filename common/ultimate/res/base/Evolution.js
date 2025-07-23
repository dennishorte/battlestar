module.exports = {
  name: `Evolution`,
  color: `blue`,
  age: 7,
  expansion: `base`,
  biscuits: `sssh`,
  dogmaBiscuit: `s`,
  dogma: [
    `You may choose to either draw and score and {8} and then return a card from your score pile, or draw a card of value one higher than the highest card in your score pile.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const selection = game.actions.choose(player, ['Draw and Score and Return', 'Draw a Higher Card'])[0]
      game.log.add({
        template: '{player} chooses {option}',
        args: { player, option: selection }
      })

      if (selection === 'Draw and Score and Return') {
        game.actions.drawAndScore(player, game.getEffectAge(self, 8))
        game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'score'))
      }
      else {
        const highest = game.utilHighestCards(game.cards.byPlayer(player, 'score'))
        if (highest.length > 0) {
          game.actions.draw(player, { age: highest[0].getAge() + 1 })
        }
        else {
          game.actions.draw(player, { age: 1 })
        }
      }
    }
  ],
}
