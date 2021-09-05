export default {
  getZone: function(name) {
    console.log('getZone', this.$store)
    return this.$store.getters['bsg/deck'](name)
  }
}
