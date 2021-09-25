const RecordKeeper = require('./recordkeeper.js').default


function stateFactory() {
  return {
    atRoot: 1,
    array: [0,1,2,3],
    object: {
      hello: 'world',
      foo: 'bar',
    },
    nestedArrays: [[1,2,['x', 'y', 'z']], ['a', 'b', 'c']],
    nested: [{}, { a: 'b' }, { arr: ['a', 'b', { c: { d: 'deep'} } ] }],
  }
}


test('has expected member variables', () => {
  const rk = new RecordKeeper('state')
  expect(rk.state).toBe('state')
  expect(rk.diffs).toStrictEqual([])
})

test('find: root state', () => {
  const rk = new RecordKeeper(stateFactory())
  const found = rk.find(rk.state)
  expect(found).toBe('.')
})

test('find: root object', () => {
  const rk = new RecordKeeper(stateFactory())
  const found = rk.find(rk.state.object)
  expect(found).toBe('.object')
})

test('find: root array', () => {
  const rk = new RecordKeeper(stateFactory())
  const found = rk.find(rk.state.array)
  expect(found).toBe('.array')
})

test('find: object in array', () => {
  const rk = new RecordKeeper(stateFactory())
  const found = rk.find(rk.state.nested[1])
  expect(found).toBe('.nested[1]')
})

test('find: nested array', () => {
  const rk = new RecordKeeper(stateFactory())
  const found = rk.find(rk.state.nestedArrays[0][2])
  expect(found).toBe('.nestedArrays[0][2]')
})

test('at: root', () => {
  const rk = new RecordKeeper(stateFactory())
  const value = rk.at('.')
  expect(value).toStrictEqual(rk.state)
})

test('at: scalar', () => {
  const rk = new RecordKeeper(stateFactory())
  const value = rk.at('.atRoot')
  expect(value).toBe(1)
})

test('at: array element', () => {
  const rk = new RecordKeeper(stateFactory())
  const value = rk.at('.array[2]')
  expect(value).toBe(2)
})

test('at: object key', () => {
  const rk = new RecordKeeper(stateFactory())
  const value = rk.at('.object.hello')
  expect(value).toBe('world')
})

test('at: nested', () => {
  const rk = new RecordKeeper(stateFactory())
  const value = rk.at('.nested[2].arr[2].c.d')
  expect(value).toBe('deep')
})

test('at: nestedArrays', () => {
  const rk = new RecordKeeper(stateFactory())
  const value = rk.at('.nestedArrays[0][2][1]')
  expect(value).toBe('y')
})

test('patch.put: root scalar', () => {
  const rk = new RecordKeeper(stateFactory())
  rk.patch({
    kind: 'put',
    path: '.',
    key: 'atRoot',
    old: 1,
    new: 2,
  })
  expect(rk.state.atRoot).toBe(2)
})

test('patch.put: root array', () => {
  const rk = new RecordKeeper(stateFactory())
  rk.patch({
    kind: 'put',
    path: '.',
    key: 'array',
    old: [0,1,2,3],
    new: ['a', 'b'],
  })
  expect(rk.state.array).toStrictEqual(['a', 'b'])
})

test('patch.put: root object', () => {
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
  expect(rk.state.object).toStrictEqual(['a', 'b'])
})

test('patch.splice', () => {
  const rk = new RecordKeeper(stateFactory())
  rk.patch({
    kind: 'splice',
    path: '.array',
    key: '1',
    old: [],
    new: [9],
  })
  expect(rk.state.array).toStrictEqual([0,9,1,2,3])
})

test('reverse.put: root scalar', () => {
  const rk = new RecordKeeper(stateFactory())
  rk.reverse({
    kind: 'put',
    path: '.',
    key: 'atRoot',
    old: 2,
    new: 1,
  })
  expect(rk.state.atRoot).toBe(2)
})

test('reverse.put: root array', () => {
  const rk = new RecordKeeper(stateFactory())
  rk.reverse({
    kind: 'put',
    path: '.',
    key: 'array',
    old: ['a', 'b'],
    new: [0,1,2,3],
  })
  expect(rk.state.array).toStrictEqual(['a', 'b'])
})

test('reverse.put: root object', () => {
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
  expect(rk.state.object).toStrictEqual(['a', 'b'])
})

test('reverse.splice', () => {
  const rk = new RecordKeeper(stateFactory())
  rk.reverse({
    kind: 'splice',
    path: '.array',
    key: '1',
    old: [9],
    new: [],
  })
  expect(rk.state.array).toStrictEqual([0,9,1,2,3])
})




test('put: root scalar', () => {
  const rk = new RecordKeeper(stateFactory())
  rk.put(rk.state, 'atRoot', 2)
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
  rk.replace(rk.state.object, 'hello')
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
  rk.replace(rk.state.nestedArrays[1], 'hello')
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
  rk.splice(rk.state.array, 1, 2, 9, 10, 11)
  const diff = {
    kind: 'splice',
    path: '.array',
    key: 1,
    old: [1, 2],
    new: [9, 10, 11],
  }
  expect(rk.diffs[0]).toStrictEqual(diff)
})
