<template>
  <div class="chat-input">
    <div class="expand">
      <input v-model="text" @keyup.enter="sendChat" placeholder="chat" class="form-control" />
    </div>

    <div>
      <button
        class="btn"
        :class="hasNewChat ? 'btn-success' : 'btn-secondary'"
        data-bs-toggle="offcanvas"
        data-bs-target="#chat-off-canvas"
      >
        chat {{ hasNewChat ? `(${hasNewChat})` : '' }}
      </button>
    </div>

  </div>
</template>


<script>
export default {
  name: 'ChatInput',

  inject: {
    chat: { from: 'chat' },
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

  computed: {
    hasNewChat() {
      // See if any chats exist before the last response of this player.
      // If yes, assume they are new.
      const rlog = [...this.game.getLog()].reverse()

      let count = 0

      for (const msg of rlog) {
        if (msg.type === 'response-received' && msg.data.actor === this.actor.name) {
          return count
        }

        if (msg.type === 'chat' && msg.author !== this.actor.name) {
          count += 1
        }
      }

      return count
    },
  },

  methods: {
    async sendChat() {
      this.chat(this.text)
      if (this.saveOnChat) {
        await this.save()
      }
      this.text = ''
    }
  },
}
</script>

<style scoped>
.chat-input {
  display: flex;
  flex-direction: row;
}

.expand {
  flex-grow: 2;
}
</style>
