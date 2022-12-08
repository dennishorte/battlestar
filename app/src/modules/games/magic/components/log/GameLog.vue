<template>
  <div class="gamelog" ref="gamelog">
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
        <div v-for="n in indentSpacers(line)" :key="n" class="indent-spacer" />
        <GameLogText :text="line.text" :class="classes(line)" />
      </template>

    </div>

    <RematchButton v-if="game.gameOver" />

    <div class="bottom-space"></div>
  </div>
</template>

<script>
import GameLogText from './GameLogText'
import RematchButton from '@/modules/games/common/components/RematchButton'


export default {
  name: 'GameLog',

  components: {
    GameLogText,
    RematchButton,
  },

  inject: ['game'],

  computed: {
    lines() {
      const output = []
      let indent = 0

      const entries = this.game.getLog()
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]

        if (entry.type === 'response-received') {
          // do nothing
        }
        else if (entry === '__INDENT__') {
        }
        else if (entry === '__OUTDENT__') {
        }
        else {
          const text = this.convertLogMessage(entry)
          const classes = entry.classes || []

          output.push({
            text,
            classes,
            args: entry.args,
            indent: entry.indent,
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

        if (arg === 'card' && !value.classes.includes('card-hidden')) {
          replacement = `card(${value.value})`
        }

        else if (arg === 'player') {
          replacement = `player(${value.value})`
        }

        else if (arg === 'loc') {
          replacement = `loc(${value.value})`
        }

        msg = msg.replace(`{${arg}}`, replacement)
      }
      return msg
    },

    classes(line) {
      const classes = [`indent-${line.indent}`]
      return classes
    },

    indentSpacers(entry) {
      if (
        entry.classes.includes('set-phase')
        || entry.classes.includes('pass-priority')
      ) {
        return 0
      }
      else {
        return Math.max(0, entry.indent - 1)
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const elem = this.$refs.gamelog
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
.gamelog {
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
  margin-top: 1px;
  padding-left: 1em;
}

.indent-spacer::before {
  content: "|\00A0";
}

.indent-0 {
  font-weight: bold;
  width: 100%;
  text-align: center;
  border-radius: .5em .5em 0 0;
  line-height: 2em;

  margin: 2em 1em 0 1em;

  color: white;
  background-color: #7db881;
}

.pass-priority {
  background-color: #dca;
  border-radius: 0 .25em .25em 0;
  width: 40%;
  padding-left: 1em;
}

.set-phase {
  background-color: #C3B091;
  border-radius: 0 .25em .25em 0;
  width: 50%;
  padding-left: 1em;
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
</style>
