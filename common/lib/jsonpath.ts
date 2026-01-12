let verbose = false

function setVerbose(value: boolean): void {
  verbose = value
}

function at(object: Record<string, unknown>, path: string): unknown {
  if (path.startsWith('.')) {
    path = path.slice(1)
  }

  if (path === '') {
    return object
  }

  const tokens = path.split('.')

  let pos: unknown = object
  for (const token of tokens) {
    if (token.endsWith(']')) {
      const pieces = token.split('[')
      const key = pieces[0]
      pos = (pos as Record<string, unknown>)[key]

      for (let i = 1; i < pieces.length; i++) {
        const index = pieces[i].substr(0, pieces[i].length - 1)
        pos = (pos as Record<string, unknown>)[index]
      }
    }
    else {
      pos = (pos as Record<string, unknown>)[token]
    }
  }

  return pos
}

type MatcherFunction = (elem: unknown) => boolean

interface PathOptions {
  max?: number
}

function path(root: unknown, target: unknown | MatcherFunction): string {
  let matcher: MatcherFunction

  if (typeof target === 'function') {
    matcher = target as MatcherFunction
  }
  else if (typeof target === 'object' && target !== null) {
    matcher = (elem) => elem === target
  }
  else {
    throw new Error(`Invalid path target. Can only path objects and arrays. Got ${typeof target}: ${target}`)
  }

  const matches: string[] = []
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

function pathAll(root: unknown, predicate: MatcherFunction): string[] {
  const matches: string[] = []
  _pathRecursive(predicate, root, matches, '', {})
  return matches
}

function _pathRecursive(matcher: MatcherFunction, root: unknown, matches: string[], pathAccumulator: string, options: PathOptions): void {
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
    for (const key of Object.keys(root as Record<string, unknown>)) {
      _pathRecursive(matcher, (root as Record<string, unknown>)[key], matches, pathAccumulator + '.' + key, options)
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

module.exports = {
  at,
  path,
  pathAll,
  setVerbose,
}

export { at, path, pathAll, setVerbose, MatcherFunction }
