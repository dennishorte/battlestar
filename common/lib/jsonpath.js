module.exports = {
  at,
  path,
  pathAll,
  setVerbose,
}

let verbose = false

function setVerbose(value) {
  verbose = value
}

function at(object, path) {
  if (path.startsWith('.')) {
    path = path.slice(1)
  }

  if (path === '') {
    return object
  }

  const tokens = path.split('.')

  let pos = object
  for (const token of tokens) {
    if (token.endsWith(']')) {
      const pieces = token.split('[')
      const key = pieces[0]
      pos = pos[key]

      for (let i = 1; i < pieces.length; i++) {
        const index = pieces[i].substr(0, pieces[i].length - 1)
        pos = pos[index]
      }
    }
    else {
      pos = pos[token]
    }
  }

  return pos
}

function path(root, target) {
  let matcher

  if (typeof target === 'function') {
    matcher = target
  }
  else if (typeof target === 'object' && target !== null) {
    matcher = (elem) => elem === target
  }
  else {
    throw new Error(`Invalid path target. Can only path objects and arrays. Got ${typeof target}: ${target}`)
  }

  const matches = []
  _pathRecursive(matcher, root, matches, '', { max: 1 })

  if (!matches) {
    if (typeof target === 'object') {
      throw new Error(`Target not found: ${JSON.stringify(target)}`)
    }
    else {
      throw new Error('No match for predicate')
    }
  }
  return matches[0]
}

function pathAll(root, predicate) {
  const matches = []
  _pathRecursive(predicate, root, matches, '', {})
  return matches
}

function _pathRecursive(matcher, root, matches, pathAccumulator, options) {
  if (verbose) {
    console.log(pathAccumulator)
  }
  if (root === undefined) {
    throw new Error(`Found undefined in path at ${pathAccumulator}`)
  }
  else if (root === null) {
    throw new Error(`Found null in path at ${pathAccumulator}`)
  }
  else if (matcher(root)) {
    matches.push(pathAccumulator || '.')
    return
  }
  else if (Array.isArray(root)) {
    for (let i = 0; i < root.length; i++) {
      _pathRecursive(matcher, root[i], matches, pathAccumulator + `[${i}]`, options)
      if (options.max && matches.length >= options.max) {
        return
      }
    }
    return
  }
  else if (typeof root === 'object') {
    for (const key of Object.keys(root)) {
      _pathRecursive(matcher, root[key], matches, pathAccumulator + '.' + key, options)
      if (options.max && matches.length >= options.max) {
        return
      }
    }
    return
  }
  else {
    return
  }
}
