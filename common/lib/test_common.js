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
//
// Accepted selection forms:
//   - `'Name'` — plain string match against a choice title. When the title
//     is shared by multiple choices in the current prompt the call throws
//     with a candidate list rather than silently picking one.
//   - `'*37'` — leading `*` is an escape hatch: returned as literal
//     (useful for digit-only strings that shouldn't be coerced to numbers).
//   - `'Parent.Child'` — dot-separated nested form for sub-selections.
//   - `{ id: '...' }` — disambiguate by the choice's stable id.
//   - `{ kind: '...', name: '...' }` — disambiguate by kind + title.
//   - `{ title, selection: [...] }` — full nested response, passed through.
TestCommon.choose = function(game, ...selections) {
  const request = game.waiting
  const selector = request.selectors[0]
  const choices = selector.choices || []

  selections = selections.map(input => {
    // Escape hatch for digit-only strings that shouldn't be coerced.
    if (typeof input === 'string' && input.startsWith('*')) {
      return input.slice(1)
    }

    // Structured disambiguation: {id} or {kind, name}.
    if (input && typeof input === 'object' && !Array.isArray(input)) {
      const hasSelection = 'selection' in input || 'choices' in input
      if (!hasSelection && input.id) {
        const match = choices.find(c => typeof c === 'object' && c.id === input.id)
        if (!match) {
          throw new Error(
            `No choice with id "${input.id}" in prompt "${selector.title}". ` +
            `Available: ${_formatChoicesForError(choices)}`
          )
        }
        return { title: match.title, id: match.id }
      }
      if (!hasSelection && input.kind && input.name) {
        const matches = choices.filter(c =>
          typeof c === 'object' && c.kind === input.kind && c.title === input.name
        )
        if (matches.length === 0) {
          throw new Error(
            `No choice with kind "${input.kind}" and title "${input.name}" in prompt "${selector.title}". ` +
            `Available: ${_formatChoicesForError(choices)}`
          )
        }
        if (matches.length > 1) {
          throw new Error(
            `Kind+name still ambiguous (${matches.length} matches) in prompt "${selector.title}". ` +
            `Use {id: '...'} instead. Candidates: ${_formatChoicesForError(matches)}`
          )
        }
        const match = matches[0]
        return match.id ? { title: match.title, id: match.id } : match.title
      }
      // Other objects (e.g. full nested {title, selection} form) fall through.
    }

    const tokens = (typeof input === 'string' ? input.split('.') : [input])
      .map(token => {
        if (util.isDigits(token)) {
          return Number(token)
        }
        else {
          return token
        }
      })

    if (tokens.length === 1) {
      const val = tokens[0]

      if (typeof val === 'string') {
        const exactMatches = choices.filter(c => (c.title || c) === val)
        // Ambiguity detection fires only when the matches are provably
        // *semantically distinct* — meaning they carry different defIds. Two
        // cards with different defIds are different things even if they
        // share a title (e.g. imperium vs conflict "Desert Power"). Multiple
        // instances of the *same* card (same defId, different instance ids)
        // are interchangeable and pick-first is correct. Games that don't
        // populate defId opt out of this check entirely, preserving prior
        // behavior.
        if (exactMatches.length > 1) {
          const distinctDefIds = new Set()
          for (const c of exactMatches) {
            if (typeof c === 'object' && c.defId) {
              distinctDefIds.add(c.defId)
            }
          }
          if (distinctDefIds.size >= 2) {
            throw new Error(
              `Choice "${val}" is ambiguous in prompt "${selector.title}": ` +
              `${exactMatches.length} options share this title and represent ` +
              `semantically distinct cards. Disambiguate with ` +
              `t.choose(game, { id: '<id>' }) or ` +
              `t.choose(game, { kind: '<kind>', name: '${val}' }). ` +
              `Candidates: ${_formatChoicesForError(exactMatches)}`
            )
          }
        }
        if (exactMatches.length === 1) {
          const match = exactMatches[0]
          // Emit structured selection when the choice has an id, so replay
          // stays collision-safe even if the prompt later gains duplicates.
          if (typeof match === 'object' && match.id) {
            return { title: match.title, id: match.id }
          }
          return val
        }
        // No exact match — try prefix match (legacy behavior):
        // e.g. 'Strategic Action' matches 'Strategic Action: leadership'.
        const prefixMatches = choices.filter(c => (c.title || c).startsWith(val + ': '))
        if (prefixMatches.length === 1) {
          const match = prefixMatches[0]
          return match.title || match
        }
        // Zero or many prefix matches: fall through and return val unchanged
        // so the downstream validator reports the real mismatch.
      }

      return val
    }
    else if (tokens.length === 2) {
      return {
        title: tokens[0],
        selection: tokens[1] === '*' ? [] : [tokens[1]]
      }
    }
    else {
      throw new Error(`Selection is too deep: ${input}`)
    }
  })

  return game.respondToInputRequest({
    actor: selector.actor,
    title: selector.title,
    selection: selections,
  })
}

function _formatChoicesForError(choices) {
  return choices.map(c => {
    if (typeof c === 'string') {
      return `"${c}"`
    }
    const parts = [`title="${c.title}"`]
    if (c.id) {
      parts.push(`id=${c.id}`)
    }
    if (c.kind) {
      parts.push(`kind=${c.kind}`)
    }
    return `{${parts.join(', ')}}`
  }).join(', ')
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
  const choices = request
    .selectors[0]
    .choices
    .filter(c => c !== 'auto')
    .map(c => c.title ? c.title : c)
    .sort()
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
