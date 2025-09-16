module.exports = {
  name: `The Big Bang`,
  color: `purple`,
  age: 9,
  expansion: `arti`,
  biscuits: `shss`,
  dogmaBiscuit: `s`,
  dogma: [
    `Execute the non-demand effects of your top blue card, without sharing. If this caused any change to occur, draw and remove a {0} from the game, then repeat this effect.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      while (true) {
        game.state.dogmaInfo.theBigBangChange = false

        const card = game.cards.top(player, 'blue')
        if (card) {
          game.aCardEffects(player, card, 'echo')
          game.aCardEffects(player, card, 'dogma')

          if (game.state.dogmaInfo.theBigBangChange) {
            game.log.add({ template: 'The game state was changed due to the card effects.' })
            const card = game.actions.draw(player, { age: game.getEffectAge(self, 10) })
            game.aRemove(player, card)
            continue
          }
          else {
            game.log.add({ template: 'No changes due to card effects' })
            break
          }
        }
        else {
          game.log.add({ template: 'No top blue card' })
          break
        }
      }
    }
  ],
}
