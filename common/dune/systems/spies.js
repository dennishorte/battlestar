const observationPosts = require('../res/observationPosts.js')

/**
 * Place a spy on an observation post.
 * Player chooses from unoccupied posts (by their own spies).
 */
function placeSpy(game, player) {
  if (player.spiesInSupply <= 0) {
    return false
  }

  const availablePosts = observationPosts.filter(post => {
    // A post can hold spies from multiple players, but a player can only have one spy per post
    const occupants = game.state.spyPosts[post.id] || []
    return !occupants.includes(player.name)
  })

  if (availablePosts.length === 0) {
    return false
  }

  const choices = availablePosts.map(post => {
    const spaceNames = post.spaces.map(id => {
      const boardSpaces = require('../res/boardSpaces.js')
      const space = boardSpaces.find(s => s.id === id)
      return space ? space.name : id
    })
    return `Post ${post.id} (${spaceNames.join(', ')})`
  })

  const [choice] = game.actions.choose(player, choices, {
    title: 'Choose an observation post for your Spy',
  })

  const postIndex = choices.indexOf(choice)
  const post = availablePosts[postIndex]

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

  const choices = playerPosts.map(post => `Post ${post.id}`)
  const [choice] = game.actions.choose(player, choices, {
    title: 'Choose a Spy to recall',
  })

  const postIndex = choices.indexOf(choice)
  const post = playerPosts[postIndex]

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

module.exports = {
  placeSpy,
  recallSpy,
  getSpyConnectedSpaces,
  hasSpyAt,
}
