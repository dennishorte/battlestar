const Stats = {}
module.exports = Stats


Stats.processInnovationStats = async function(cursor) {
  const collected = {
    count: 0,
    winBy: {}
  }

  for await (const datum of cursor) {
    count += 1

    //console.log(datum)
    break
  }
}
