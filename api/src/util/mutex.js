module.exports = {
  delay,
  Mutex,
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms))
}

function Mutex() {
  this.mutex = Promise.resolve()
}

Mutex.prototype.lock = function() {
  let begin = (unlock) => {}

  this.mutex = this.mutex.then(() => {
    return new Promise(begin)
  })

  return new Promise(res => {
    begin = res
  })
}

Mutex.prototype.dispatch = async function(fn) {
  const unlock = await this.lock()
  try {
    return await Promise.resolve(fn())
  }
  catch (e) {
    throw e
  }
  finally {
    unlock()
  }
}
