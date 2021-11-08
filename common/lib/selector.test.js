const { validate } = require('./selector.js')

test('names must match', () => {
  const selector = {
    name: 'test',
    options: ['one', 'two']
  }
  expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(true)
  expect(validate(selector, { name: 'foo', option: ['one'] }).valid).toBe(false)
})

test('string options', () => {
  const selector = {
    name: 'test',
    options: ['one', 'two']
  }
  expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(true)
  expect(validate(selector, { name: 'test', option: ['two'] }).valid).toBe(true)
  expect(validate(selector, { name: 'test', option: [] }).valid).toBe(false)
  expect(validate(selector, { name: 'test', option: ['foo'] }).valid).toBe(false)
  expect(validate(selector, { name: 'test', option: ['one', 'two'] }).valid).toBe(false)
})

describe('non-nested object options', () => {
  const selector = {
    name: 'test',
    options: [
      { name: 'one' },
      { name: 'two' },
    ]
  }

  test('string selections', () => {
    expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['two'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: [] }).valid).toBe(false)
    expect(validate(selector, { name: 'test', option: ['foo'] }).valid).toBe(false)
    expect(validate(selector, { name: 'test', option: ['one', 'two'] }).valid).toBe(false)
  })

  test('object selections', () => {
    expect(validate(selector, { name: 'test', option: [{ name: 'one' }] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: [{ name: 'two' }] }).valid).toBe(true)
  })
})

describe('nested options', () => {
  const selector = {
    name: 'test',
    options: [
      {
        name: 'one',
        options: ['a', 'b'],
      },
      {
        name: 'two',
        options: ['x', 'y'],
      }
    ]
  }

  test('basic matches', () => {
    expect(validate(selector, {
      name: 'test',
      option: [{
        name: 'one',
        option: ['a']
      }]
    }).valid).toBe(true)

    expect(validate(selector, {
      name: 'test',
      option: [{
        name: 'two',
        option: ['x']
      }]
    }).valid).toBe(true)
  })

  test('basic mismatches', () => {
    expect(validate(selector, {
      name: 'test',
      option: ['one']
    }).valid).toBe(false)

    expect(validate(selector, {
      name: 'test',
      option: [{
        name: 'one',
        option: ['x']
      }]
    }).valid).toBe(false)

    expect(validate(selector, {
      name: 'test',
      option: [{ name: 'one' }]
    }).valid).toBe(false)
  })

  test('can only pick from one', () => {
    expect(validate(selector, {
      name: 'test',
      option: [
        {
          name: 'one',
          option: ['b'],
        },
        {
          name: 'two',
          option: ['x']
        }
      ]
    }).valid).toBe(false)
  })

  test('nested invalids make top level invalid', () => {
    const selector = {
      name: "Movement",
      options: [
        {
          name: "Galactica",
          options: [
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
      name: 'Movement',
      option: [{
        name: 'Galactica',
        option: ['Armory', 'Command'],
      }]
    }
    expect(validate(selector, selection).valid).toBe(false)
  })
})

describe('count', () => {
  const selector = {
    name: 'test',
    count: 2,
    options: ['one', 'two', 'three']
  }

  test('not enough selections', () => {
    expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(false)
    expect(validate(selector, { name: 'test', option: [] }).valid).toBe(false)
    expect(validate(selector, { name: 'test', option: ['foo'] }).valid).toBe(false)
  })

  test('too many selections', () => {
    expect(validate(selector, { name: 'test', option: ['one', 'two', 'three'] }).valid).toBe(false)

  })

  test('correct number', () => {
    expect(validate(selector, { name: 'test', option: ['one', 'two'] }).valid).toBe(true)
  })

  test('correct number, but duplicates', () => {
    expect(validate(selector, { name: 'test', option: ['one', 'one'] }).valid).toBe(false)
  })

  test('order does not matter', () => {
    expect(validate(selector, { name: 'test', option: ['three', 'two'] }).valid).toBe(true)
  })

  test('count with nested options', () => {
    const selector = {
      name: 'test',
      options: [
        {
          name: 'one',
          max: 1,
          options: ['a', 'b']
        },
        {
          name: 'two',
          max: 1,
          options: ['x', 'y']
        }
      ]
    }

    const selection = {
      name: 'test',
      option: [{
        name: 'one',
        option: ['a']
      }]
    }

    expect(validate(selector, selection).valid).toBe(true)
  })
})

describe('min and max', () => {

  test('neither', () => {
    const selector = {
      name: 'test',
      options: ['one', 'two', 'three']
    }

    expect(validate(selector, { name: 'test', option: [] }).valid).toBe(false)
    expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one', 'two'] }).valid).toBe(false)
  })

  test('min0, max1', () => {
    const selector = {
      name: 'test',
      min: 0,
      max: 1,
      options: ['one', 'two', 'three']
    }

    expect(validate(selector, { name: 'test', option: [] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one', 'two'] }).valid).toBe(false)
  })

  test('max1', () => {
    const selector = {
      name: 'test',
      max: 1,
      options: ['one', 'two', 'three']
    }

    expect(validate(selector, { name: 'test', option: [] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one', 'two'] }).valid).toBe(false)
  })

  test('min1', () => {
    const selector = {
      name: 'test',
      min: 1,
      options: ['one', 'two', 'three']
    }

    expect(validate(selector, { name: 'test', option: [] }).valid).toBe(false)
    expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one', 'two'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one', 'two', 'three'] }).valid).toBe(true)
  })

})

describe('extra', () => {
  const selector = {
    name: 'test',
    options: [
      'one',
      'two',
      {
        name: 'extra',
        extra: true
      },
    ],
  }

  test('no extra selected', () => {
    expect(validate(selector, { name: 'test', option: [] }).valid).toBe(false)
    expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one', 'two'] }).valid).toBe(false)
  })

  test('extra does not count toward required count', () => {
    expect(validate(selector, { name: 'test', option: ['extra'] }).valid).toBe(false)
  })

  test('extra does not count against required count', () => {
    expect(validate(selector, { name: 'test', option: ['one', 'extra'] }).valid).toBe(true)
  })
})

describe('exclusive', () => {
  const selector = {
    name: 'test',
    max: 2,
    options: [
      'one',
      'two',
      {
        name: 'exclusive',
        exclusive: true
      },
    ],
  }

  test('Cannot mix with other options', () => {
    expect(validate(selector, { name: 'test', option: [] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one', 'two'] }).valid).toBe(true)

    expect(validate(selector, { name: 'test', option: ['exclusive'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one', 'exclusive'] }).valid).toBe(false)
  })
})
