<template>
  <OffCanvas id="chat-off-canvas">
    <div v-for="chat in chats"
         :key="`${chat.author}-${chat.text}`"
         class="chat"
         :class="chatClasses(chat)"
         :style="styles(chat)">
      {{ chat.author }}: {{ chat.text }}
    </div>

    <div
      class="toggle"
      :class="hasNewChat ? 'notif' : ''"
      data-bs-toggle="offcanvas"
      data-bs-target="#chat-off-canvas"
    />

  </OffCanvas>
</template>


<script>
import OffCanvas from '@/components/OffCanvas'


export default {
  name: 'ChatOffCanvas',

  components: {
    OffCanvas,
  },

  inject: ['actor', 'game'],

  props: {
    classes: {
      type: Object,
      default: null,
    },
    colors: {
      type: Object,
      default: null,
    },
  },

  computed: {
    chats() {
      return this
        .game
        .getMergedLog()
        .filter(x => x.type === 'chat')
    },

    hasNewChat() {
      return this.game.getNewChatCount(this.actor) > 0
    },
  },

  methods: {
    chatClasses(chat) {
      const classes = []

      if (chat.author === this.actor.name) {
        classes.push('chat-self')
      }
      else {
        classes.push('chat-other')
      }

      if (this.classes) {
        if (chat.author in this.classes) {
          classes.push(this.classes[chat.author])
        }
      }

      return classes
    },

    styles(chat) {
      if (this.colors) {
        if (chat.author in this.colors) {
          return {
            'background-color': this.colors[chat.author],
          }
        }
        else if (chat.author === this.actor.name) {
          return {
            'background-color': 'green',
          }
        }
        else {
          return {
            'background-color': 'blue',
          }
        }
      }
    },
  },
}
</script>


<style scoped>
#chat-off-canvas:deep() .offcanvas-body {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.chat {
  padding: .25em .5em;
  border-radius: .25em;
  margin-left: 1em;
  text-align: right;
  margin-bottom: .25em;
  max-width: fit-content;
}

.chat-other {
  text-align: left;
  margin-right: 4em;
}

.chat-self {
  margin-left: 4em;
}

.toggle {
  position: absolute;
  visibility: visible;
  width: 20px;
  height: 100px;
  right: -20px;
  bottom: 25px;
  background-color: rgba(0, 0, 0, .5);
  border-radius: 0 8px 8px 0;
}

.toggle.notif {
  background-color: rgba(255, 0, 0, .5);
}
</style>
