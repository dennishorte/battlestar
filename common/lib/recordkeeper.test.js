const RecordKeeper = require('./recordkeeper.js')


function stateFactory() {
  return {
    atRoot: 1,
    array: [0,1,2,3],
    object: {
      hello: 'world',
      foo: 'bar',
    },
    history: [],
    nestedArrays: [[1,2,['x', 'y', 'z']], ['a', 'b', 'c']],
    nested: [{}, { a: 'b' }, { arr: ['a', 'b', { c: { d: 'deep'} } ] }],
  }
}


test('has expected member variables', () => {
  const game = { history: [] }
  const rk = new RecordKeeper(game)
  expect(rk.game).toBe(game)
  expect(rk.diffs).toStrictEqual([])
  expect(rk.undone).toStrictEqual([])
})

describe('path', () => {

  test('root state', () => {
    const rk = new RecordKeeper(stateFactory())
    const found = rk.path(rk.game)
    expect(found).toBe('.')
  })

  test('root object', () => {
    const rk = new RecordKeeper(stateFactory())
    const found = rk.path(rk.game.object)
    expect(found).toBe('.object')
  })

  test('root array', () => {
    const rk = new RecordKeeper(stateFactory())
    const found = rk.path(rk.game.array)
    expect(found).toBe('.array')
  })

  test('object in array', () => {
    const rk = new RecordKeeper(stateFactory())
    const found = rk.path(rk.game.nested[1])
    expect(found).toBe('.nested[1]')
  })

  test('nested array', () => {
    const rk = new RecordKeeper(stateFactory())
    const found = rk.path(rk.game.nestedArrays[0][2])
    expect(found).toBe('.nestedArrays[0][2]')
  })
})

describe('at', () => {
  test('root', () => {
    const rk = new RecordKeeper(stateFactory())
    const value = rk.at('.')
    expect(value).toStrictEqual(rk.game)
  })

  test('scalar', () => {
    const rk = new RecordKeeper(stateFactory())
    const value = rk.at('.atRoot')
    expect(value).toBe(1)
  })

  test('array element', () => {
    const rk = new RecordKeeper(stateFactory())
    const value = rk.at('.array[2]')
    expect(value).toBe(2)
  })

  test('object key', () => {
    const rk = new RecordKeeper(stateFactory())
    const value = rk.at('.object.hello')
    expect(value).toBe('world')
  })

  test('nested', () => {
    const rk = new RecordKeeper(stateFactory())
    const value = rk.at('.nested[2].arr[2].c.d')
    expect(value).toBe('deep')
  })

  test('nestedArrays', () => {
    const rk = new RecordKeeper(stateFactory())
    const value = rk.at('.nestedArrays[0][2][1]')
    expect(value).toBe('y')
  })
})

describe('undo', () => {
  function setup() {
    const rk = new RecordKeeper(stateFactory())
    rk.put(rk.game, 'atRoot', [0, 1, 2])
    rk.splice(rk.game.atRoot, 1, 2, 'a')
    rk.put(rk.game, 'atRoot', 'hello')
    return rk
  }

  test('undo one', () => {
    const rk = setup()
    rk.undo()
    expect(rk.diffs.length).toBe(2)
    expect(rk.undone.length).toBe(1)
    expect(rk.game.atRoot).toStrictEqual([0, 'a'])
  })

  test('undo three', () => {
    const rk = setup()
    rk.undo()
    rk.undo()
    rk.undo()
    expect(rk.diffs.length).toBe(0)
    expect(rk.undone.length).toBe(3)
    expect(rk.game.atRoot).toBe(1)
  })

  test('undo/redo three', () => {
    const rk = setup()
    rk.undo()
    rk.undo()
    rk.undo()
    rk.redo()
    rk.redo()
    rk.redo()
    expect(rk.diffs.length).toBe(3)
    expect(rk.undone.length).toBe(0)
    expect(rk.game.atRoot).toBe('hello')
  })
})

describe('patch', () => {
  test('put: root scalar', () => {
    const rk = new RecordKeeper(stateFactory())
    rk.patch({
      kind: 'put',
      path: '.',
      key: 'atRoot',
      old: 1,
      new: 2,
    })
    expect(rk.game.atRoot).toBe(2)
  })

  test('put: root array', () => {
    const rk = new RecordKeeper(stateFactory())
    rk.patch({
      kind: 'put',
      path: '.',
      key: 'array',
      old: [0,1,2,3],
      new: ['a', 'b'],
    })
    expect(rk.game.array).toStrictEqual(['a', 'b'])
  })

  test('put: root object', () => {
    const rk = new RecordKeeper(stateFactory())
    rk.patch({
      kind: 'put',
      path: '.',
      key: 'object',
      old: {
        hello: 'world',
        foo: 'bar',
      },
      new: ['a', 'b'],
    })
    expect(rk.game.object).toStrictEqual(['a', 'b'])
  })

  test('splice', () => {
    const rk = new RecordKeeper(stateFactory())
    rk.patch({
      kind: 'splice',
      path: '.array',
      key: '1',
      old: [],
      new: [9],
    })
    expect(rk.game.array).toStrictEqual([0,9,1,2,3])
  })
})

describe('reverse', () => {
  test('put: root scalar', () => {
    const rk = new RecordKeeper(stateFactory())
    rk.reverse({
      kind: 'put',
      path: '.',
      key: 'atRoot',
      old: 2,
      new: 1,
    })
    expect(rk.game.atRoot).toBe(2)
  })

  test('put: root array', () => {
    const rk = new RecordKeeper(stateFactory())
    rk.reverse({
      kind: 'put',
      path: '.',
      key: 'array',
      old: ['a', 'b'],
      new: [0,1,2,3],
    })
    expect(rk.game.array).toStrictEqual(['a', 'b'])
  })

  test('put: root object', () => {
    const rk = new RecordKeeper(stateFactory())
    rk.reverse({
      kind: 'put',
      path: '.',
      key: 'object',
      old: ['a', 'b'],
      new: {
        hello: 'world',
        foo: 'bar',
      },
    })
    expect(rk.game.object).toStrictEqual(['a', 'b'])
  })

  test('splice', () => {
    const rk = new RecordKeeper(stateFactory())
    rk.reverse({
      kind: 'splice',
      path: '.array',
      key: '1',
      old: [9],
      new: [],
    })
    expect(rk.game.array).toStrictEqual([0,9,1,2,3])
  })

})


describe('single changes', () => {
  test('put: root scalar', () => {
    const rk = new RecordKeeper(stateFactory())
    rk.put(rk.game, 'atRoot', 2)
    const diff = {
      kind: 'put',
      path: '.',
      key: 'atRoot',
      old: 1,
      new: 2,
    }
    expect(rk.diffs[0]).toStrictEqual(diff)
  })

  test('replace: object key', () => {
    const rk = new RecordKeeper(stateFactory())
    rk.replace(rk.game.object, 'hello')
    const diff = {
      kind: 'put',
      path: '.',
      key: 'object',
      old: {
        hello: 'world',
        foo: 'bar',
      },
      new: 'hello'
    }
    expect(rk.diffs[0]).toStrictEqual(diff)
  })

  test('replace: array element', () => {
    const rk = new RecordKeeper(stateFactory())
    rk.replace(rk.game.nestedArrays[1], 'hello')
    const diff = {
      kind: 'put',
      path: '.nestedArrays',
      key: 1,
      old: ['a', 'b', 'c'],
      new: 'hello',
    }
    expect(rk.diffs[0]).toStrictEqual(diff)
  })

  test('splice', () => {
    const rk = new RecordKeeper(stateFactory())
    rk.splice(rk.game.array, 1, 2, 9, 10, 11)
    const diff = {
      kind: 'splice',
      path: '.array',
      key: 1,
      old: [1, 2],
      new: [9, 10, 11],
    }
    expect(rk.diffs[0]).toStrictEqual(diff)
  })

  test('pop', () => {
    const rk = new RecordKeeper(stateFactory())
    rk.pop(rk.game.array)
    expect(rk.game.array).toStrictEqual([0,1,2])
  })

  test('push', () => {
    const rk = new RecordKeeper(stateFactory())
    rk.push(rk.game.array, 8)
    expect(rk.game.array).toStrictEqual([0,1,2,3,8])
  })

  test('move', () => {
    const rk = new RecordKeeper(stateFactory())
    rk.move(rk.game.nested[2].arr[2], rk.game.array)
    expect(rk.game.array).toStrictEqual([0,1,2,3,{ c: { d: 'deep' } }])
  })

  test('move with index', () => {
    const rk = new RecordKeeper(stateFactory())
    rk.move(rk.game.nested[2].arr[2], rk.game.array, 1)
    expect(rk.game.array).toStrictEqual([0,{ c: { d: 'deep' } },1,2,3])
  })
})

describe('multiple changes', () => {

  test('put, splice', () => {
    const rk = new RecordKeeper(stateFactory())
    rk.put(rk.game, 'atRoot', [0, 1, 2])
    rk.splice(rk.game.atRoot, 1, 2, 'a')
    const diffs = [
      {
        kind: 'put',
        path: '.',
        key: 'atRoot',
        old: 1,
        new: [0,1,2],
      },
      {
        kind: 'splice',
        path: '.atRoot',
        key: 1,
        old: [1, 2],
        new: ['a'],
      },
    ]
    expect(rk.diffs).toStrictEqual(diffs)
  })

})
