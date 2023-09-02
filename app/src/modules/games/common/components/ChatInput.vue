<template>
  <div class="chat-input">
    <input v-model="text" @keyup.enter="sendChat" placeholder="chat" class="form-control" />
  </div>
</template>


<script>
export default {
  name: 'ChatInput',

  inject: {
    game: { from: 'game' },
    actor: { from: 'actor' },
    save: {
      from: 'save',
      default: null
    },
  },

  props: {
    saveOnChat: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      text: '',
    }
  },

  methods: {
    async sendChat() {
      this.game.respondToInputRequest({
        actor: this.actor.name,
        type: 'chat',
        text: this.text,
      })

      if (this.saveOnChat) {
        if (this.save) {
          await this.save()
        }
        else if (this.game.save) {
          await this.game.save()
        }
        else {
          alert('No save function provided')
        }
      }
      this.text = ''
    }
  },
}
</script>
