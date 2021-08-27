<template>
<div
  class="holding-message"
  :class="[hidden ? 'd-none' : '']"
  >

  <div class="message">
    {{ message }}
  </div>

  <b-button @click="cancel" variant="primary">cancel</b-button>
</div>
</template>


<script>
export default {
  name: 'HoldingMessage',

  computed: {
    hidden() {
      return !this.$store.state.bsg.ui.grabbing.message
    },
    message() {
      return this.$store.state.bsg.ui.grabbing.message
    },
  },

  methods: {
    cancel() {
      this.$store.commit('bsg/grabCancel')
    },
  },
}
</script>


<style scoped>
.holding-message {
    position: fixed;
    top: 0;
    width: 100%;
    height: 4em;
    z-index: 1000;

    padding: .5em;

    background-color: cyan;
    box-shadow: 0 10px 10px cyan;

    display: flex;
    justify-content: space-between;
}

.message {
    margin-top: .7em;
    margin-left: 1em;
}
</style>
