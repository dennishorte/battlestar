import log from './log.js'
import util from './util.js'

const TestCommon = {
  // Basic fixture to set up a game
  fixture: function() {
    throw new Error('not implemented')
  },

  // Fixture that takes a dict object defining the desired game state
  gameFixture: function() {
    throw new Error('not implemented')
  },

  // Fundamental test function that checks the state of the whole game, or specified parts
  testBoard: function() {
    throw new Error('not implemented')
  },

  dennis: function(game) {
    return game.players.byName('dennis')
  },

  // Select an option from the input request. (Game.requestInputMany)
  choose: function(game, request, ...selections) {
    const selector = request.selectors[0]
    const processedSelections = selections.map(string => {
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
      selection: processedSelections,
    })
  },

  // Perform the specified action, which is from an "any" input request. (Game.requestInputAny)
  do: function(game, request, action) {
    const selector = request.selectors[0]

    return game.respondToInputRequest({
      actor: selector.actor,
      title: selector.title,
      selection: [action],
    })
  },

  deepLog: function(obj) {
    console.log(JSON.stringify(obj, null, 2))
    // console.log(jsUtil.inspect(obj, false, 3, true))
  },

  dumpLog: function(game) {
    const output = []
    for (const entry of game.log.getLog()) {
      if (entry.type === 'response-received') {
        continue
      }
      output.push(log.toString(entry))
    }
    console.log(output.join('\n'))
  },

  dumpZones: function(root) {
    console.log(_dumpZonesRecursive(root))
  }
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

export default TestCommon
