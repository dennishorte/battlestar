module.exports = {
  id: "master-workman-a126",
  name: "Master Workman",
  deck: "occupationA",
  number: 126,
  type: "occupation",
  players: "1+",
  text: "Each time before you use an action space card on round spaces 1/2/3/4, you get 1 wood/clay/reed/stone.",
  matches_onBeforeAction(game, _player, actionId) {
    const actionRound = game.getActionSpaceRound(actionId)
    return actionRound >= 1 && actionRound <= 4
  },
  onBeforeAction(game, player, actionId) {
    const actionRound = game.getActionSpaceRound(actionId)
    const resources = { 1: 'wood', 2: 'clay', 3: 'reed', 4: 'stone' }
    player.addResource(resources[actionRound], 1)
    game.log.add({
      template: '{player} gets 1 {resource}',
      args: { player, resource: resources[actionRound] },
    })
  },
}
