module.exports = {
  name: `Clock`,
  color: `purple`,
  age: 4,
  expansion: `echo`,
  biscuits: `&5hs`,
  dogmaBiscuit: `s`,
  echo: [`You may splay your color with the most cards right.`],
  dogma: [
    `I demand you transfer all cards of value equal to the number of visible cards on my board of the color of my choice from your hand and score pile to my score pile. Junk an available achievement of that value.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const choices = game.util.colors().map(color => {
        const count = game.getVisibleCardsByZone(leader, color)
        return `${color} (${count})`
      })

      const selected = game.actions.choose(leader, choices, { title: 'Choose a color' })
      const color = selected[0].split(' ')[0]
      const count = game.getVisibleCardsByZone(leader, color)

      game.log.add({
        template: '{player} chooses {color} ({count})',
        args: { player, color, count },
      })

      const toTransfer = [
        ...game.cards.byPlayer(player, 'hand'),
        ...game.cards.byPlayer(player, 'score'),
      ].filter(card => card.getAge() === count)

      game.actions.transferMany(player, toTransfer, game.zones.byPlayer(leader, 'score'))

      game.actions.junkAvailableAchievement(player, [count])
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
