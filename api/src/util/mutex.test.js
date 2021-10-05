const { Mutex, delay } = require('./mutex.js')

describe('mutex', () => {
  test('returns correct value', async () => {
    const mutex = new Mutex()
    const result = await mutex.dispatch(() => {
      return 1
    })
    expect(result).toBe(1)
  })

  test('correctly orders two actions', async () => {
    const mutex = new Mutex()
    const array = []

    mutex.dispatch(async () => {
      await delay(200)
      array.push(1)
    })

    mutex.dispatch(() => {
      array.push(2)
    })

    await delay(300)

    expect(array).toStrictEqual([1,2])
  })

  test('propagates exceptions', async () => {
    const mutex = new Mutex()
    const errorFunc = async () => {
      return await mutex.dispatch(() => {
        throw new Error()
      })
    }
    await expect(errorFunc).rejects.toThrow()
  })
})
