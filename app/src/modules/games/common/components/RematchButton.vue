<template>
  <button class="rematch-button btn btn-primary" @click="rematch">Rematch</button>
</template>


<script>
import axios from 'axios'

export default {
  name: 'RematchButton',

  inject: ['game', 'save'],

  methods: {
    async rematch() {
      await save()

      const result = await axios.post('/api/game/rematch', { gameId: this.game._id })
      if (result.data.status === 'success') {
        this.$router.push(result.data.redirect)
      }
      else {
        alert(result.data.message)
      }
    },
  },
}
</script>
