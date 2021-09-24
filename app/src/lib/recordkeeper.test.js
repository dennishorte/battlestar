const RecordKeeper = require('./recordkeeper.js').default

test('has expected member variables', () => {
  console.log(RecordKeeper)
  const rk = new RecordKeeper('state')
  expect(rk.state).toBe('state')
  expect(rk.diffs).toStrictEqual([])
})
