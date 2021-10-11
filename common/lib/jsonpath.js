module.exports = {
  at,
  path,
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
    throw `Invalid path target. Can only path objects and arrays. Got ${typeof target}: ${target}`
  }

  const result = _pathRecursive(matcher, root, '')
  if (!result) {
    if (typeof target === 'object') {
      throw new Error(`Target not found: ${JSON.stringify(target)}`)
    }
    else {
      throw new Error('No match for predicate')
    }
  }
  return result
}

function _pathRecursive(matcher, root, pathAccumulator) {
  if (matcher(root)) {
    return pathAccumulator || '.'
  }
  else if (Array.isArray(root)) {
    for (let i = 0; i < root.length; i++) {
      const result = _pathRecursive(matcher, root[i], pathAccumulator + `[${i}]`)
      if (result) {
        return result
      }
    }
    return false
  }
  else if (typeof root === 'object') {
    for (const key of Object.keys(root)) {
      const result = _pathRecursive(matcher, root[key], pathAccumulator + '.' + key)
      if (result) {
        return result
      }
    }
    return false
  }
  else {
    return false
  }
}
