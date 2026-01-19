export default {
  name: `Private Eye`,
  color: `blue`,
  age: 7,
  expansion: `usee`,
  biscuits: `llsh`,
  dogmaBiscuit: `l`,
  dogma: [
    `I demand you reveal your hand! Transfer the card in your hand of my choice to my board! Draw a {7}!`,
    `Score one of your secrets.`,
    `You may splay your blue cards right.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const hand = game.cards.byPlayer(player, 'hand')
      game.actions.revealMany(player, hand, { ordered: true })

      const card = game.actions.chooseCard(leader, hand)
      if (card) {
        game.actions.transfer(player, card, game.zones.byPlayer(leader, card.color))
        game.actions.draw(player, { age: game.getEffectAge(self, 7) })
      }
    },
    (game, player) => {
      const secrets = game.cards.byPlayer(player, 'safe')
      game.actions.chooseAndScore(player, secrets)
    },
    (game, player) => {
      game.actions.chooseAndSplay(player, ['blue'], 'right')
    }
  ],
}
