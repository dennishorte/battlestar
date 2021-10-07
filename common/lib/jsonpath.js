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
  if (typeof target !== 'object' || target === null) {
    throw `Invalid path target. Can only path objects and arrays. Got ${typeof target}: ${target}`
  }

  const result = _pathRecursive(target, root, '')
  if (!result) {
    throw `Target not found: ${target}`
  }
  return result
}

function _pathRecursive(target, root, pathAccumulator) {
  if (root === target) {
    return pathAccumulator || '.'
  }
  else if (Array.isArray(root)) {
    for (let i = 0; i < root.length; i++) {
      const result = _pathRecursive(target, root[i], pathAccumulator + `[${i}]`)
      if (result) {
        return result
      }
    }
  }
  else if (typeof root === 'object') {
    for (const key of Object.keys(root)) {
      const result = _pathRecursive(target, root[key], pathAccumulator + '.' + key)
      if (result) {
        return result
      }
    }
  }
  else {
    return false
  }
}
