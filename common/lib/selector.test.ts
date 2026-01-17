const { validate } = require('./selector.js')

test('titles must match', () => {
  const selector = {
    title: 'test',
    choices: ['one', 'two']
  }
  expect(validate(selector, { title: 'test', selection: ['one'] }).valid).toBe(true)
  expect(validate(selector, { title: 'foo', selection: ['one'] }).valid).toBe(false)
})

test('string choices', () => {
  const selector = {
    title: 'test',
    choices: ['one', 'two']
  }
  expect(validate(selector, { title: 'test', selection: ['one'] }).valid).toBe(true)
  expect(validate(selector, { title: 'test', selection: ['two'] }).valid).toBe(true)
  expect(validate(selector, { title: 'test', selection: [] }).valid).toBe(false)
  expect(validate(selector, { title: 'test', selection: ['foo'] }).valid).toBe(false)
  expect(validate(selector, { title: 'test', selection: ['one', 'two'] }).valid).toBe(false)
})

describe('non-nested object choices', () => {
  const selector = {
    title: 'test',
    choices: [
      { title: 'one' },
      { title: 'two' },
    ]
  }

  test('string selections', () => {
    expect(validate(selector, { title: 'test', selection: ['one'] }).valid).toBe(true)
    expect(validate(selector, { title: 'test', selection: ['two'] }).valid).toBe(true)
    expect(validate(selector, { title: 'test', selection: [] }).valid).toBe(false)
    expect(validate(selector, { title: 'test', selection: ['foo'] }).valid).toBe(false)
    expect(validate(selector, { title: 'test', selection: ['one', 'two'] }).valid).toBe(false)
  })

  test('object selections', () => {
    expect(validate(selector, { title: 'test', selection: [{ title: 'one' }] }).valid).toBe(true)
    expect(validate(selector, { title: 'test', selection: [{ title: 'two' }] }).valid).toBe(true)
  })
})

describe('nested choices', () => {
  const selector = {
    title: 'test',
    choices: [
      {
        title: 'one',
        choices: ['a', 'b'],
      },
      {
        title: 'two',
        choices: ['x', 'y'],
      }
    ]
  }

  test('basic matches', () => {
    expect(validate(selector, {
      title: 'test',
      selection: [{
        title: 'one',
        selection: ['a']
      }]
    }).valid).toBe(true)

    expect(validate(selector, {
      title: 'test',
      selection: [{
        title: 'two',
        selection: ['x']
      }]
    }).valid).toBe(true)
  })

  test('basic mismatches', () => {
    expect(validate(selector, {
      title: 'test',
      selection: ['one']
    }).valid).toBe(false)

    expect(validate(selector, {
      title: 'test',
      selection: [{
        title: 'one',
        selection: ['x']
      }]
    }).valid).toBe(false)

    expect(validate(selector, {
      title: 'test',
      selection: [{ title: 'one' }]
    }).valid).toBe(false)
  })

  test('can only pick from one', () => {
    expect(validate(selector, {
      title: 'test',
      selection: [
        {
          title: 'one',
          selection: ['b'],
        },
        {
          title: 'two',
          selection: ['x']
        }
      ]
    }).valid).toBe(false)
  })

  test('nested invalids make top level invalid', () => {
    const selector = {
      title: "Movement",
      choices: [
        {
          title: "Galactica",
          choices: [
            "Admiral's Quarters",
            "Armory",
            "Command",
            "Communications",
            "FTL Control",
            "Hangar Deck",
            "Research Lab",
            "Weapons Control"
          ]
        },
      ]
    }
    const selection = {
      title: 'Movement',
      selection: [{
        title: 'Galactica',
        selection: ['Armory', 'Command'],
      }]
    }
    expect(validate(selector, selection).valid).toBe(false)
  })
})

describe('count', () => {
  const selector = {
    title: 'test',
    count: 2,
    choices: ['one', 'two', 'three']
  }

  test('not enough selections', () => {
    expect(validate(selector, { title: 'test', selection: ['one'] }).valid).toBe(false)
    expect(validate(selector, { title: 'test', selection: [] }).valid).toBe(false)
    expect(validate(selector, { title: 'test', selection: ['foo'] }).valid).toBe(false)
  })

  test('too many selections', () => {
    expect(validate(selector, { title: 'test', selection: ['one', 'two', 'three'] }).valid).toBe(false)

  })

  test('correct number', () => {
    expect(validate(selector, { title: 'test', selection: ['one', 'two'] }).valid).toBe(true)
  })

  test('correct number, but duplicates', () => {
    expect(validate(selector, { title: 'test', selection: ['one', 'one'] }).valid).toBe(false)
  })

  test('order does not matter', () => {
    expect(validate(selector, { title: 'test', selection: ['three', 'two'] }).valid).toBe(true)
  })

  test('count with nested choices', () => {
    const selector = {
      title: 'test',
      choices: [
        {
          title: 'one',
          max: 1,
          choices: ['a', 'b']
        },
        {
          title: 'two',
          max: 1,
          choices: ['x', 'y']
        }
      ]
    }

    const selection = {
      title: 'test',
      selection: [{
        title: 'one',
        selection: ['a']
      }]
    }

    expect(validate(selector, selection).valid).toBe(true)
  })
})

describe('min and max', () => {

  test('neither', () => {
    const selector = {
      title: 'test',
      choices: ['one', 'two', 'three']
    }

    expect(validate(selector, { title: 'test', selection: [] }).valid).toBe(false)
    expect(validate(selector, { title: 'test', selection: ['one'] }).valid).toBe(true)
    expect(validate(selector, { title: 'test', selection: ['one', 'two'] }).valid).toBe(false)
  })

  test('min0, max1', () => {
    const selector = {
      title: 'test',
      min: 0,
      max: 1,
      choices: ['one', 'two', 'three']
    }

    expect(validate(selector, { title: 'test', selection: [] }).valid).toBe(true)
    expect(validate(selector, { title: 'test', selection: ['one'] }).valid).toBe(true)
    expect(validate(selector, { title: 'test', selection: ['one', 'two'] }).valid).toBe(false)
  })

  test('max1', () => {
    const selector = {
      title: 'test',
      max: 1,
      choices: ['one', 'two', 'three']
    }

    expect(validate(selector, { title: 'test', selection: [] }).valid).toBe(true)
    expect(validate(selector, { title: 'test', selection: ['one'] }).valid).toBe(true)
    expect(validate(selector, { title: 'test', selection: ['one', 'two'] }).valid).toBe(false)
  })

  test('min1', () => {
    const selector = {
      title: 'test',
      min: 1,
      choices: ['one', 'two', 'three']
    }

    expect(validate(selector, { title: 'test', selection: [] }).valid).toBe(false)
    expect(validate(selector, { title: 'test', selection: ['one'] }).valid).toBe(true)
    expect(validate(selector, { title: 'test', selection: ['one', 'two'] }).valid).toBe(true)
    expect(validate(selector, { title: 'test', selection: ['one', 'two', 'three'] }).valid).toBe(true)
  })

  test('max1 with fake selection', () => {
    const selector = {
      title: 'test',
      choices: [
        {
          title: 'nested',
          max: 1,
          choices: ['one']
        },
        'unnested'
      ]
    }

    const selection = {
      title: 'test',
      selection: [
        {
          title: 'nested',
          selection: ['fake']
        }
      ]
    }

    expect(validate(selector, selection).valid).toBe(false)
  })

})

describe('extra', () => {
  const selector = {
    title: 'test',
    choices: [
      'one',
      'two',
      {
        title: 'extra',
        extra: true
      },
    ],
  }

  test('no extra selected', () => {
    expect(validate(selector, { title: 'test', selection: [] }).valid).toBe(false)
    expect(validate(selector, { title: 'test', selection: ['one'] }).valid).toBe(true)
    expect(validate(selector, { title: 'test', selection: ['one', 'two'] }).valid).toBe(false)
  })

  test('extra does not count toward required count', () => {
    expect(validate(selector, { title: 'test', selection: ['extra'] }).valid).toBe(false)
  })

  test('extra does not count against required count', () => {
    expect(validate(selector, { title: 'test', selection: ['one', 'extra'] }).valid).toBe(true)
  })
})

describe('exclusive', () => {
  const selector = {
    title: 'test',
    max: 2,
    choices: [
      'one',
      'two',
      {
        title: 'exclusive',
        exclusive: true
      },
    ],
  }

  test('Cannot mix with other selections', () => {
    expect(validate(selector, { title: 'test', selection: [] }).valid).toBe(true)
    expect(validate(selector, { title: 'test', selection: ['one'] }).valid).toBe(true)
    expect(validate(selector, { title: 'test', selection: ['one', 'two'] }).valid).toBe(true)

    expect(validate(selector, { title: 'test', selection: ['exclusive'] }).valid).toBe(true)
    expect(validate(selector, { title: 'test', selection: ['one', 'exclusive'] }).valid).toBe(false)
  })
})
