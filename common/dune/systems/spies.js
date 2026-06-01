const boardSpaces = require('../res/boardSpaces.js')
const observationPosts = require('../res/observationPosts.js')

function postFactions(post) {
  const factions = new Set()
  for (const id of post.spaces) {
    const space = boardSpaces.find(s => s.id === id)
    if (space?.faction) {
      factions.add(space.faction)
    }
  }
  return factions
}

function postIcons(post) {
  const icons = new Set()
  for (const id of post.spaces) {
    const space = boardSpaces.find(s => s.id === id)
    if (space?.icon) {
      icons.add(space.icon)
    }
  }
  return icons
}

/**
 * Place a spy on an observation post. By default each post holds at most one
 * spy across all players. Options:
 *   - allowOccupied: allow placing on a post that already has another spy
 *     (used by abilities like Double Agent that explicitly grant this).
 *   - factions: array of faction ids; restrict to posts connected to a space
 *     of one of those factions (e.g. Reliable Informant: emperor/BG/fremen).
 */
function placeSpy(game, player, options = {}) {
  if (player.spiesInSupply <= 0) {
    return false
  }

  const { allowOccupied = false, factions = null, icons = null } = options
  const factionFilter = factions ? new Set(factions) : null
  const iconFilter = icons ? new Set(icons) : null

  const availablePosts = observationPosts.filter(post => {
    const occupants = game.state.spyPosts[post.id] || []
    if (occupants.includes(player.name)) {
      return false
    }
    if (!allowOccupied && occupants.length > 0) {
      return false
    }
    if (factionFilter) {
      const pf = postFactions(post)
      let match = false
      for (const f of pf) {
        if (factionFilter.has(f)) {
          match = true
          break
        }
      }
      if (!match) {
        return false
      }
    }
    if (iconFilter) {
      const pi = postIcons(post)
      let match = false
      for (const i of pi) {
        if (iconFilter.has(i)) {
          match = true
          break
        }
      }
      if (!match) {
        return false
      }
    }
    return true
  })

  if (availablePosts.length === 0) {
    return false
  }

  const choices = availablePosts.map(post => {
    const spaceNames = post.spaces.map(id => {
      const space = boardSpaces.find(s => s.id === id)
      return space ? space.name : id
    })
    return game.actions.option({
      id: `post-${post.id}`,
      title: `Post ${post.id} (${spaceNames.join(', ')})`,
      kind: 'observation-post',
    })
  })

  const [choice] = game.actions.choose(player, choices, {
    title: 'Choose an observation post for your Spy',
  })

  const choiceId = typeof choice === 'object' ? choice.id : null
  const choiceTitle = typeof choice === 'object' ? choice.title : choice
  const post = choiceId
    ? availablePosts.find(p => `post-${p.id}` === choiceId)
    : availablePosts[choices.findIndex(c => c.title === choiceTitle)]

  player.decrementCounter('spiesInSupply', 1, { silent: true })

  if (!game.state.spyPosts[post.id]) {
    game.state.spyPosts[post.id] = []
  }
  game.state.spyPosts[post.id].push(player.name)

  game.log.add({
    template: '{player} places a Spy on Post {postId}',
    args: { player, postId: post.id },
  })

  return true
}

/**
 * Recall a spy from a post (used for Infiltrate and Gather Intelligence).
 * Returns the post the spy was recalled from, or null.
 */
function recallSpy(game, player) {
  const playerPosts = observationPosts.filter(post => {
    const occupants = game.state.spyPosts[post.id] || []
    return occupants.includes(player.name)
  })

  if (playerPosts.length === 0) {
    return null
  }

  const choices = playerPosts.map(post => game.actions.option({
    id: `post-${post.id}`,
    title: `Post ${post.id}`,
    kind: 'observation-post',
  }))
  const [choice] = game.actions.choose(player, choices, {
    title: 'Choose a Spy to recall',
  })

  const choiceId = typeof choice === 'object' ? choice.id : null
  const choiceTitle = typeof choice === 'object' ? choice.title : choice
  const post = choiceId
    ? playerPosts.find(p => `post-${p.id}` === choiceId)
    : playerPosts.find(p => `Post ${p.id}` === choiceTitle)

  const occupants = game.state.spyPosts[post.id]
  occupants.splice(occupants.indexOf(player.name), 1)
  player.incrementCounter('spiesInSupply', 1, { silent: true })

  game.log.add({
    template: '{player} recalls a Spy from Post {postId}',
    args: { player, postId: post.id },
  })

  return post
}

/**
 * Get board space IDs connected to posts where a player has a spy.
 */
function getSpyConnectedSpaces(game, player) {
  const connected = new Set()
  for (const post of observationPosts) {
    const occupants = game.state.spyPosts[post.id] || []
    if (occupants.includes(player.name)) {
      for (const spaceId of post.spaces) {
        connected.add(spaceId)
      }
    }
  }
  return connected
}

/**
 * Check if a player has a spy on a post connected to a given board space.
 */
function hasSpyAt(game, player, spaceId) {
  return getSpyConnectedSpaces(game, player).has(spaceId)
}

/**
 * Recall a spy from a post connected to a specific board space.
 * If multiple posts connect to the space, the player chooses which spy to recall.
 */
function recallSpyAt(game, player, spaceId) {
  const connectedPosts = observationPosts.filter(post => {
    const occupants = game.state.spyPosts[post.id] || []
    return occupants.includes(player.name) && post.spaces.includes(spaceId)
  })

  if (connectedPosts.length === 0) {
    return null
  }

  let post
  if (connectedPosts.length === 1) {
    post = connectedPosts[0]
  }
  else {
    const choices = connectedPosts.map(p => game.actions.option({
      id: `post-${p.id}`,
      title: `Post ${p.id}`,
      kind: 'observation-post',
    }))
    const [choice] = game.actions.choose(player, choices, {
      title: 'Choose which Spy to recall',
    })
    const choiceId = typeof choice === 'object' ? choice.id : null
    const choiceTitle = typeof choice === 'object' ? choice.title : choice
    post = choiceId
      ? connectedPosts.find(p => `post-${p.id}` === choiceId)
      : connectedPosts.find(p => `Post ${p.id}` === choiceTitle)
  }

  const occupants = game.state.spyPosts[post.id]
  occupants.splice(occupants.indexOf(player.name), 1)
  player.incrementCounter('spiesInSupply', 1, { silent: true })

  game.log.add({
    template: '{player} recalls a Spy from Post {postId}',
    args: { player, postId: post.id },
  })

  return post
}

/**
 * Place a spy on a specific observation post, bypassing the interactive
 * chooser. Used by abilities that dictate the post (e.g. Lady Margot Fenring,
 * Staban Tuek).
 */
function placeSpyAt(game, player, postId, options = {}) {
  if (player.spiesInSupply <= 0) {
    return false
  }
  const post = observationPosts.find(p => p.id === postId)
  if (!post) {
    return false
  }
  const { allowOccupied = false } = options
  const occupants = game.state.spyPosts[post.id] || []
  if (occupants.includes(player.name)) {
    return false
  }
  if (!allowOccupied && occupants.length > 0) {
    return false
  }
  player.decrementCounter('spiesInSupply', 1, { silent: true })
  if (!game.state.spyPosts[post.id]) {
    game.state.spyPosts[post.id] = []
  }
  game.state.spyPosts[post.id].push(player.name)
  game.log.add({
    template: '{player} places a Spy on Post {postId}',
    args: { player, postId: post.id },
  })
  return true
}

module.exports = {
  placeSpy,
  placeSpyAt,
  recallSpy,
  recallSpyAt,
  getSpyConnectedSpaces,
  hasSpyAt,
}
