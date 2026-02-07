const { GameOverEvent } = require('./game.js')
const util = require('./util.js')

const TestCommon = {}

// Basic fixture to set up a game
TestCommon.fixture = function() {
  throw new Error('not implemented')
}

// Fixture that takes a dict object defining the desired game state
TestCommon.gameFixture = function() {
  throw new Error('not implemented')
}

// Fundamental test function that checks the state of the whole game, or specified parts
TestCommon.testBoard = function() {
  throw new Error('not implemented')
}


TestCommon.dennis = function(game) {
  return game.players.byName('dennis')
}

// Select an option from the input request. (Game.requestInputMany)
TestCommon.choose = function(game, ...selections) {
  const request = game.waiting
  const selector = request.selectors[0]
  selections = selections.map(string => {
    if (typeof string === 'string' && string.startsWith('*')) {
      return string.slice(1)
    }

    const tokens = (typeof string === 'string' ? string.split('.') : [string])
      .map(token => {
        if (util.isDigits(token)) {
          return Number(token)
        }
        else {
          return token
        }
      })

    if (tokens.length === 1) {
      return tokens[0]
    }
    else if (tokens.length === 2) {
      return {
        title: tokens[0],
        selection: tokens[1] === '*' ? [] : [tokens[1]]
      }
    }
    else {
      throw new Error(`Selection is too deep: ${string}`)
    }
  })

  return game.respondToInputRequest({
    actor: selector.actor,
    title: selector.title,
    selection: selections,
  })
}

// Perform the specified action, which is from an "any" input request. (Game.requestInputAny)
TestCommon.do = function(game, action) {
  const request = game.waiting
  const selector = request.selectors[0]

  return game.respondToInputRequest({
    actor: selector.actor,
    title: selector.title,
    selection: [action],
  })
}

TestCommon.deepLog = function(obj) {
  console.log(JSON.stringify(obj, null, 2))
  // console.log(jsUtil.inspect(obj, false, 3, true))
}

TestCommon.dumpLog = function(game) {
  game.dumpLog()
}

function _dumpZonesRecursive(root, indent=0) {
  const output = []

  if (root.id) {
    output.push(root.id)
    for (const card of root.cardlist()) {
      output.push(`   ${card.id}`)
    }
  }

  else {
    for (const zone of Object.values(root)) {
      output.push(_dumpZonesRecursive(zone, indent+1))
    }
  }

  return output.join('\n')
}

TestCommon.dumpZones = function(root) {
  console.log(_dumpZonesRecursive(root))
}


////////////////////////////////////////////////////////////////////////////////
// Common test assertions

TestCommon.testActionChoices = function(request, action, expected) {
  const actionChoices = request.selectors[0].choices.find(c => c.title === action).choices
  // Handle both string choices and object choices with title property
  const choiceNames = actionChoices.map(c => typeof c === 'object' ? c.title : c)
  expect(choiceNames.sort()).toEqual(expected.sort())
}

TestCommon.testChoices = function(request, expected, expectedMin, expectedMax) {
  const choices = request.selectors[0].choices.filter(c => c !== 'auto').sort()
  expect(choices).toEqual(expected.sort())

  if (expectedMax) {
    const { min, max } = request.selectors[0]
    expect(min).toBe(expectedMin)
    expect(max).toBe(expectedMax)
  }

  // This is actually just count
  else if (expectedMin) {
    expect(request.selectors[0].count).toBe(expectedMin)
  }
}

TestCommon.testGameOver = function(request, playerName, reason) {
  expect(request).toEqual(expect.any(GameOverEvent))
  expect(request.data.player).toBe(playerName)
  expect(request.data.reason).toBe(reason)
}

TestCommon.testNotGameOver = function(request) {
  expect(request).not.toEqual(expect.any(GameOverEvent))
}

TestCommon.testIsSecondPlayer = function(game, expectedTitle = 'Choose First Action') {
  const request = game.waiting
  const selector = request.selectors[0]
  expect(selector.actor).toBe('micah')
  expect(selector.title).toBe(expectedTitle)
}


module.exports = TestCommon
