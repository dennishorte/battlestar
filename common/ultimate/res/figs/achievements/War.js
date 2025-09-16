module.exports = {
  id: 'War',
  name: 'War',
  shortName: 'war',
  expansion: 'figs',
  text: "Choose a value. Return all top cards of that value from all other players' boards.",
  alt: '',
  isSpecialAchievement: false,
  isDecree: true,
  decreeImpl: (game, player) => {
    const value = game.requestInputSingle({
      actor: player.name,
      title: 'Choose an Age',
      choices: [1,2,3,4,5,6,7,8,9,10]
    })[0]

    game.log.add({
      template: '{player} chooses {age}',
      args: {
        player,
        age: value
      }
    })

    const cardsToReturn = []
    for (const opponent of game.getPlayerOpponents(player)) {
      for (const card of game.getTopCards(opponent)) {
        if (card.getAge() === value) {
          cardsToReturn.push(card)
        }
      }
    }

    game.actions.returnMany(player, cardsToReturn)
  }
}
