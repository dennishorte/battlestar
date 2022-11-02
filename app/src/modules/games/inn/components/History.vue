<template>
  <div class="history" ref="history">
    <div v-for="(line, index) in lines" :key="index" :class="line.classes" class="log-line">

      <template v-if="line.isChat">
        <div class="chat-container">
          <div class="chat-message">
            <span class="chat-author">{{ line.author.name }}:</span>
            {{ line.text }}
          </div>
        </div>
      </template>

      <template v-else>
        <div v-for="n in line.indent" :key="n" class="indent-spacer" />
        <CardText :text="line.text" />
      </template>
    </div>
    <div class="bottom-space"></div>
  </div>
</template>

<script>
import CardText from './CardText'

export default {
  name: 'History',

  components: {
    CardText,
  },

  inject: ['game'],

  computed: {
    lines() {
      if (!this.game) {
        return []
      }

      const output = []
      let indent = 0

      const entries = this.game.getLog()
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]

        if (entry.type === 'response-received') {
          // do nothing
        }
        else if (entry === '__INDENT__') {
          indent += 1
        }
        else if (entry === '__OUTDENT__') {
          indent -= 1
        }
        else {
          const text = this.convertLogMessage(entry)
          const classes = entry.classes || []

          if (
            text.includes(' chooses ')
            || text.startsWith('Demands will be made of')
            || text.startsWith('Effects will share with')
          ) {
            classes.push('faded-text')
          }

          output.push({
            text,
            classes,
            indent: Math.max(0, indent - 1),
          })
        }

        // Insert any chats that go after this entry.
        this
          .game
          .getChat()
          .filter(x => x.position === i + 1)
          .forEach(chat => {
            output.push({
              text: chat.text,
              author: this.game.getPlayerByName(chat.player),
              isChat: true,
            })
          })
      }
      return output
    }
  },

  watch: {
    lines: {
      handler() {
        this.scrollToBottom()
        window.scrollTo(0,0)
      },
      flush: 'post',
      deep: true,
    },
  },

  methods: {
    convertLogMessage(entry) {
      let msg = entry.template
      for (const [arg, value] of Object.entries(entry.args)) {
        let replacement = value.value

        if (arg === 'card' && !value.value.startsWith('*')) {
          replacement = `card(${value.value})`
        }

        else if (arg === 'player') {
          replacement = `player(${value.value})`
        }

        msg = msg.replace(`{${arg}}`, replacement)
      }
      return msg
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const elem = this.$refs.history
        elem.scrollTo({
          top: 99999,
          behavior: 'smooth',
        })
      })
    },
  },

  mounted() {
    this.scrollToBottom()
  },
}
</script>

<style scoped>
.history {
  font-size: .8rem;
  overflow-y: scroll;
}

.bottom-space {
  height: 2em;
}

.chat-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: .25em;
  width: 100%;
}

.chat-message {
  color: #eee;
  background-color: blue;
  padding: .25em .5em;
  border-radius: .25em;
  margin-left: 1em;
  text-align: right;
}

.chat-author {
  font-size: .8em;
  line-height: .5em;
  margin-top: -.5em;;
}

.log-line {
  display: flex;
  flex-direction: row;
}

.indent-spacer::before {
  content: "…\00A0";
}

.player-turn-start {
  font-weight: bold;
  font-size: 1.2em;
  margin-top: 1em;
  background-color: lightgreen;
  border-radius: .2em;
}
.player-turn-start::before {
  content: "—";
}
.player-turn-start::after {
  content: "—";
}

.action-header {
  font-weight: bold;
  margin-top: .5em;
}

.faded-text {
  font-weight: 200;
  color: lightgray;
}

.card-effect {
  background-color: lightgray;
  border-radius: .5em;
}
</style>
