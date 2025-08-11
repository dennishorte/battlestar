module.exports = {
  name: `Clock`,
  color: `purple`,
  age: 4,
  expansion: `echo`,
  biscuits: `&5hs`,
  dogmaBiscuit: `s`,
  echo: [`You may splay your color with the most cards right.`],
  dogma: [
    `I demand you draw and reveal three {0}, total the number of {i} on them, and then return them! Transfer all cards of that value from your hand and score pile to my score pile!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const drawn = [
        game.actions.drawAndReveal(player, game.getEffectAge(this, 10)),
        game.actions.drawAndReveal(player, game.getEffectAge(this, 10)),
        game.actions.drawAndReveal(player, game.getEffectAge(this, 10)),
      ].filter(card => card !== undefined)

      const totalClocks = drawn
        .map(card => card.biscuits.split('').filter(b => b === 'i').length)
        .reduce((agg, r) => agg + r, 0)

      game.mLog({ template: `Total {i} is ${totalClocks}.` })

      game.aReturnMany(player, drawn)

      const toTransfer = [
        game.cards.byPlayer(player, 'hand').filter(card => card.getAge() === totalClocks),
        game.cards.byPlayer(player, 'score').filter(card => card.getAge() === totalClocks),
      ].flat()

      game.actions.transferMany(player, toTransfer, game.zones.byPlayer(leader, 'score'))
    }
  ],
  echoImpl: [
    (game, player) => {
      const colorStacks = game
        .util.colors()
        .map(color => game.zones.byPlayer(player, color))

      const mostCards = colorStacks
        .map(zone => zone.cardlist().length)
        .sort((l, r) => r - l)[0]

      const choices = colorStacks
        .filter(zone => zone.cardlist().length === mostCards)
        .map(zone => zone.color)

      game.actions.chooseAndSplay(player, choices, 'right')
    }
  ],
}
