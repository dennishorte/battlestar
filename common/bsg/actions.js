/*
   All actions are automatically wrapped in a session.
 */


const Actions = {}

Actions.aAssignAdmiral = function(player) {
  player = this._adjustPlayerParam(player)
  const card = this.getCardByName('Admiral')
  const playerHand = this.getZoneByPlayer(player).cards
  this.mLog({
    template: '{player} becomes the Admiral',
    args: {
      player: player.name
    }
  })
  this.rk.session.move(card, playerHand)
}

Actions.aAssignPresident = function(player) {
  player = this._adjustPlayerParam(player)
  const card = this.getCardByName('President')
  const playerHand = this.getZoneByPlayer(player.name).cards
  this.mLog({
    template: '{player} becomes the President',
    args: {
      player: player.name
    }
  })
  this.rk.session.move(card, playerHand)
}

Actions.aDrawSkillCards = function(player, skills) {
  this.mLog({
    template: `{player} draws {skills}`,
    actor: player.name,
    args: {
      player: player.name,
      skills: skills.join(', ')
    }
  })

  for (const skill of skills) {
    this.mDrawSkillCard(player, skill)
  }
}

Actions.aDestroyColonialOne = function() {
  this.mLog({
    template: 'Colonial One destroyed',
    actor: 'admin'
  })

  this.rk.session.put(this.state.flags, 'colonialOneDestroyed', true)

  for (const location of this.getLocationsByArea('Colonial One')) {
    for (const card of location.cards) {
      if (card.kind === 'player-token') {
        this.mLog({
          template: '{player} sent to {location}',
          actor: 'admin',
          args: {
            player: card.name,
            location: 'Sickbay'
          }
        })

        this.mMovePlayer(card.name, 'Sickbay')
      }
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// Exports

function wrapper(func) {
  return function() {
    this.rk.sessionStart(() => {
      func.call(this, ...arguments)
    })
  }
}


const wrappedActions = {}

for (const [name, func] of Object.entries(Actions)) {
  wrappedActions[name] = wrapper(func)
}

module.exports = wrappedActions
