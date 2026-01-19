export default {
  name: `Karaoke`,
  color: `purple`,
  age: 9,
  expansion: `echo`,
  biscuits: `hl9&`,
  dogmaBiscuit: `l`,
  echo: `Draw and meld a card of value present in your hand.`,
  dogma: [
    `Transfer your bottom card of each color to your hand.`,
    `Claim an available achievement of value equal to the card you last medled due to Karaoke's echo effect during this action, regardless of eligibility. If you do, self-execute the melded card.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const toTransfer = game.cards.bottoms(player)
      game.actions.transferMany(player, toTransfer, game.zones.byPlayer(player, 'hand'), { ordered: true })
    },

    (game, player, { self }) => {
      if (!game.state.dogmaInfo.karaoke) {
        game.log.add({
          template: '{player} did not meld any cards during the echo effect',
          args: { player }
        })
        return
      }

      const card = game.state.dogmaInfo.karaoke[player.name]
      const options = game
        .getAvailableStandardAchievements(player)
        .filter(ach => ach.getAge() === card.getAge())

      const achieved = game.actions.chooseAndAchieve(player, options)

      if (achieved) {
        game.aSelfExecute(self, player, card)
      }
    },
  ],
  echoImpl: (game, player) => {
    if (!game.state.dogmaInfo.karaoke) {
      game.state.dogmaInfo.karaoke = {}
    }

    const handAges = game.cards.byPlayer(player, 'hand').map(card => card.getAge())
    const ages = game.getAges().filter(age => handAges.includes(age))
    const age = game.actions.chooseAge(player, ages)

    if (age) {
      const card = game.actions.drawAndMeld(player, age)
      if (card) {
        game.state.dogmaInfo.karaoke[player.name] = card
      }
    }
    else {
      game.log.add({
        template: '{player} has no cards in hand',
        args: { player }
      })
    }
  },
}
