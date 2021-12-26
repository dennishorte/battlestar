const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'artifact',
      func: _artifact,
      resp: _artifactResp,
    },
    {
      name: 'choose1',
      func: _choose1,
      resp: _chooseResp,
    },
    {
      name: 'choose2',
      func: _choose2,
      resp: _chooseResp,
    },
  ],
})

function _artifact(context) {
  const { game, actor } = context
  const artifact = game.getArtifact(actor)

  if (artifact) {
    return context.wait({
      actor: actor.name,
      name: 'Artifact on Display',
      options: [
        {
          name: 'Artifact Dogma',
          kind: 'dogma',
          share: [],
          demand: [],
        },
        {
          name: 'Return Artifact',
        },
      ]
    })
  }
}

function _artifactResp(context) {

}

function _choose1(context) {
  return _choose(context, 1)
}

function _choose2(context) {
  const totalActions = _numberOfActions(context)
  if (totalActions < 2) {
    return context.done()
  }

  return _choose(context, 2)
}

function _choose(context, count) {
  const options = []

  _addAchievements(context, options)
  _addDecrees(context, options)
  _addDogmas(context, options)
  _addDraw(context, options)
  _addEndore(context, options)
  _addInspire(context, options)
  _addMeld(context, options)

  const totalActions = _numberOfActions(context)

  return context.wait({
    actor: context.data.playerName,
    name: `Action (${count} of ${total})`,
    options
  })
}

function _chooseResp(context) {

}

function _numberOfActions(context) {
  return 2
}
