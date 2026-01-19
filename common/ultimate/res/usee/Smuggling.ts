export default {
  name: `Smuggling`,
  color: `green`,
  age: 3,
  expansion: `usee`,
  biscuits: `cchc`,
  dogmaBiscuit: `c`,
  dogma: [
    `I demand you transfer a card of value equal to your top yellow card and a card of value equal to my top yellow card from your score pile to my score pile!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      for (const target of [player, leader]) {
        const topYellow = game.cards.top(target, 'yellow')
        if (topYellow) {
          const choices = game
            .cards.byPlayer(player, 'score')
            .filter(c => c.getAge() === topYellow.getAge())
          game.actions.chooseAndTransfer(player, choices, game.zones.byPlayer(leader, 'score'), {
            title: 'Transfer a card for ' + target.name,
            count: 1,
          })
        }
      }
    },
  ],
}
