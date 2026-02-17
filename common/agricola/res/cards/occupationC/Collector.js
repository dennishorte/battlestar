module.exports = {
  id: "collector-c104",
  name: "Collector",
  deck: "occupationC",
  number: 104,
  type: "occupation",
  players: "1+",
  text: "This card is an action space for you only. When you use it for the 1st/2nd/3rd/4th time, you get 1 begging marker and 6/7/8/9 different goods of your choice.",
  providesActionSpace: true,
  actionSpaceId: 'collector',
  ownerOnly: true,
  onPlay(game, _player) {
    game.cardState(this.id).useCount = 0
  },
  onActionSpaceUsed(game, player) {
    const s = game.cardState(this.id)
    s.useCount = (s.useCount || 0) + 1
    const goodsCount = 5 + s.useCount
    player.addResource('beggingCards', 1)

    const card = this
    const allGoods = ['wood', 'clay', 'reed', 'stone', 'grain', 'vegetables', 'food']
    const remaining = [...allGoods]
    const chosen = []

    for (let i = 0; i < goodsCount && remaining.length > 0; i++) {
      const selection = game.actions.choose(player, remaining, {
        title: `${card.name}: Choose good ${i + 1} of ${goodsCount}`,
        min: 1,
        max: 1,
      })
      const resource = selection[0]
      chosen.push(resource)
      remaining.splice(remaining.indexOf(resource), 1)
      player.addResource(resource, 1)
    }

    game.log.add({
      template: '{player} chooses {count} goods via {card}: {goods}',
      args: { player, count: chosen.length, card, goods: chosen.join(', ') },
    })
  },
}
