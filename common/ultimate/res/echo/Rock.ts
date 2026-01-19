
export default {
  name: `Rock`,
  color: `purple`,
  age: 9,
  expansion: `echo`,
  biscuits: `l9hl`,
  dogmaBiscuit: `l`,
  echo: ``,
  dogma: [
    `I demand you transfer your top green card to my hand! If Scissors is your new top green card, I win!`,
    `You may score a top card from your board. If Paper is your top green card, you win.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const card = game.cards.top(player, 'green')
      if (card) {
        game.actions.transfer(player, card, game.zones.byPlayer(leader, 'hand'))

        const next = game.cards.top(player, 'green')
        if (next && next.name === 'Scissors') {
          game.youWin(leader, self.name)
        }
      }
    },

    (game, player, { self }) => {
      game.actions.chooseAndScore(player, game.cards.tops(player), { min: 0, max: 1 })

      const card = game.cards.top(player, 'green')
      if (card && card.name === 'Paper') {
        game.youWin(player, self.name)
      }
    }
  ],
  echoImpl: [],
}
