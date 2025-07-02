module.exports = {
  name: `Espionage`,
  color: `blue`,
  age: 1,
  expansion: `usee`,
  biscuits: `khkk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I demand you reveal a card in your hand. If you do, and I have no card in my hand of the same color, transfer it to my hand, then repeat this effect!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      while (true) {
        const hand = game.getCardsByZone(player, 'hand')

        const revealed = game.aChooseAndReveal(player, hand, {
          title: 'Choose a card to reveal',
          count: 1,
        })[0]

        if (!revealed) {
          break
        }

        const leaderHand = game.getCardsByZone(leader, 'hand')
        game.log.add({
          template: '{player} reveals their hand',
          args: { player: leader }
        })
        game.aRevealMany(leader, leaderHand, { ordered: true })

        if (!leaderHand.some(c => c.color === revealed.color)) {
          game.mTransfer(player, revealed, game.getZoneByPlayer(leader, 'hand'))
          game.log.add({ template: 'Repeat this effect' })
        }
        else {
          break
        }
      }
    },
  ],
}
