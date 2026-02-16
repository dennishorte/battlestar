module.exports = {
  id: "omnifarmer-e134",
  name: "Omnifarmer",
  deck: "occupationE",
  number: 134,
  type: "occupation",
  players: "1+",
  text: "Each harvest, you can place 1 harvested crop or 1 newborn animal on this card, irretrievably. Once this game, exchange 2/3/4/5 different goods on this for 3/5/7/9 bonus points.",
  allowsAnytimeAction: true,
  onPlay(game, _player) {
    const s = game.cardState(this.id)
    s.goods = []
    s.exchanged = false
  },
  onHarvest(game, player) {
    const s = game.cardState(this.id)
    const choices = []
    if (player.grain >= 1) {
      choices.push('Place 1 grain')
    }
    if (player.vegetables >= 1) {
      choices.push('Place 1 vegetable')
    }
    if (player.getTotalAnimals('sheep') >= 1) {
      choices.push('Place 1 sheep')
    }
    if (player.getTotalAnimals('boar') >= 1) {
      choices.push('Place 1 boar')
    }
    if (player.getTotalAnimals('cattle') >= 1) {
      choices.push('Place 1 cattle')
    }
    choices.push('Skip')
    if (choices.length === 1) {
      return
    }

    const selection = game.actions.choose(player, choices, {
      title: 'Omnifarmer: Place a good on this card?',
      min: 1,
      max: 1,
    })
    if (selection[0] === 'Skip') {
      return
    }

    const good = selection[0].replace('Place 1 ', '')
    if (['sheep', 'boar', 'cattle'].includes(good)) {
      player.removeAnimals(good, 1)
    }
    else {
      player.removeResource(good, 1)
    }
    s.goods.push(good)
    game.log.add({
      template: '{player} places 1 {good} on Omnifarmer ({total} goods)',
      args: { player, good, total: s.goods.length },
    })
  },
  getAnytimeActions(game, _player) {
    const s = game.cardState(this.id)
    if (!s.exchanged && s.goods && s.goods.length >= 2) {
      const uniqueGoods = new Set(s.goods).size
      const pointsMap = { 2: 3, 3: 5, 4: 7, 5: 9 }
      const points = pointsMap[Math.min(5, uniqueGoods)] || 0
      return [{
        id: `omnifarmer-exchange`,
        label: `Omnifarmer: Exchange ${s.goods.length} goods for ${points} VP`,
        type: 'card-custom',
        cardId: this.id,
        cardName: this.name,
        actionKey: 'respondAnytimeAction',
      }]
    }
    return []
  },
  respondAnytimeAction(game, player, _action) {
    const s = game.cardState(this.id)
    const uniqueGoods = new Set(s.goods).size
    const pointsMap = { 2: 3, 3: 5, 4: 7, 5: 9 }
    const points = pointsMap[Math.min(5, uniqueGoods)] || 0
    if (points > 0) {
      player.bonusPoints = (player.bonusPoints || 0) + points
      s.exchanged = true
      game.log.add({
        template: '{player} exchanges {count} goods for {points} bonus points via Omnifarmer',
        args: { player, count: s.goods.length, points },
      })
    }
  },
}
