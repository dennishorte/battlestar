<template>
  <div class="chat-input">
    <div class="expand">
      <input v-model="text"
             @keyup.enter="sendChat"
             placeholder="chat"
             class="form-control" />
    </div>

    <div>
      <button
        class="btn"
        :class="newChatCount > 0 ? 'btn-success' : 'btn-secondary'"
        data-bs-toggle="offcanvas"
        data-bs-target="#chat-off-canvas"
      >
        chat {{ newChatCount ? `(${newChatCount})` : '' }}
      </button>
    </div>

  </div>
</template>


<script>
export default {
  name: 'ChatInput',

  inject: {
    game: { from: 'game' },
    actor: { from: 'actor' },
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
    newChatCount() {
      return this.game.log.newChatsCount(this.actor)
    },
  },

  methods: {
    async sendChat() {
      this.game.mChat(this.actor.name, this.text)
      if (this.saveOnChat) {
        await this.$store.dispatch('game/save')
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
