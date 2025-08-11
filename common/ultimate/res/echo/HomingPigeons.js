module.exports = {
  name: `Homing Pigeons`,
  color: `green`,
  age: 3,
  expansion: `echo`,
  biscuits: `3lhl`,
  dogmaBiscuit: `l`,
  echo: [],
  dogma: [
    `I demand you return two cards from your score pile whose values each match a card in my hand!`,
    `You may splay your red or green cards left. If Homing Pigeons was foreseen, splay all your colors left.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const ages = game
        .cards.byPlayer(leader, 'hand')
        .map(card => card.getAge())
      const choices = game
        .cards.byPlayer(player, 'score')
        .filter(card => ages.includes(card.getAge()))
      game.actions.chooseAndReturn(player, choices, { count: 2 })
    },

    (game, player, { foreseen, self }) => {
      if (foreseen) {
        game.mLogWasForeseen(self)
        for (const color of game.util.colors()) {
          game.aSplay(player, color, 'left')
        }
      }
      else {
        game.actions.chooseAndSplay(player, ['green', 'red'], 'left')
      }
    }
  ],
  echoImpl: [],
}
