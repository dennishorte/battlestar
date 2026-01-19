export default {
  name: `Necronomicon`,
  color: `purple`,
  age: 3,
  expansion: `arti`,
  biscuits: `hlll`,
  dogmaBiscuit: `l`,
  dogma: [
    `Draw and reveal a {3}. If it is yellow: return all cards in your hand; green: unsplay all your colors; red: return all cards in your score pile; blue: draw a {9}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 3))
      if (card) {
        game.log.add({ template: `Card is ${card.color}` })

        if (card.color === 'yellow') {
          game.log.add({
            template: '{player} will return all cards from hand',
            args: { player }
          })
          game.actions.returnMany(player, game.cards.byPlayer(player, 'hand'))
        }

        else if (card.color === 'green') {
          game.log.add({
            template: '{player} will unsplay all stacks',
            args: { player }
          })
          for (const color of game.util.colors()) {
            game.actions.unsplay(player, color)
          }
        }

        else if (card.color === 'red') {
          game.log.add({
            template: '{player} will return all cards from score',
            args: { player }
          })
          game.actions.returnMany(player, game.cards.byPlayer(player, 'score'))
        }

        else if (card.color === 'blue') {
          game.log.add({
            template: '{player} will draw a {9}',
            args: { player }
          })
          game.actions.draw(player, { age: game.getEffectAge(self, 9) })
        }

        else {
          game.log.addNoEffect()
        }
      }
    }
  ],
}
