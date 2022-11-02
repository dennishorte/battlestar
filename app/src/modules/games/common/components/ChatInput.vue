<template>
  <div class="chat-input">
    <input v-model="text" @keyup.enter="sendChat" placeholder="chat" class="form-control" />
  </div>
</template>


<script>
export default {
  name: 'ChatInput',

  inject: ['game', 'actor'],

  data() {
    return {
      text: '',
    }
  },

  methods: {
    async sendChat() {
      await this.game.mChat(this.actor.name, this.text)
      console.log(this.game.getChat())
      this.text = ''
    }
  },
}
</script>
