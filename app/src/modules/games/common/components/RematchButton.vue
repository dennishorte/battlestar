<template>
  <button class="rematch-button btn btn-primary" @click="rematch">Rematch</button>
</template>


<script>
export default {
  name: 'RematchButton',

  inject: ['game'],

  methods: {
    async rematch() {
      const { redirect } = await this.$post('/api/game/rematch', { gameId: this.game._id })
      this.$router.push(redirect)
    },
  },
}
</script>
