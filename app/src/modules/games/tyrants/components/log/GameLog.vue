<template>
  <div class="gamelog" ref="gamelog">
    <div v-for="(line, index) in lines" :key="index" :class="line.classes" class="log-line">

      <template v-if="line.type === 'chat'">
        <div class="chat-container">
          <div class="chat-message">
            <span class="chat-author">{{ line.author }}:</span>
            {{ line.text }}
          </div>
        </div>
      </template>

      <template v-else>
        <div v-for="n in line.indent" :key="n" class="indent-spacer" />
        <GameLogText :text="line.text" :class="classes(line)" :style="styles(line)" />
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

  inject: ['game', 'ui'],

  computed: {
    lines() {
      const output = []
      let indent = 0

      const entries = this.game.getMergedLog()
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]

        if (entry.type === 'response-received') {
          // do nothing
        }
        else if (entry === '__INDENT__') {
        }
        else if (entry === '__OUTDENT__') {
        }
        else if (entry.type === 'chat') {
          output.push(entry)
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

        else if (arg === 'loc') {
          replacement = `loc(${value.value})`
        }

        msg = msg.replace(`{${arg}}`, replacement)
      }
      return msg
    },

    classes(line) {
      const classes = [`indent-${line.indent}`]

      if (line.classes && line.classes.includes('player-turn')) {
        const playerName = line.args.player.value
        const player = this.game.getPlayerByName(playerName)
        const color = this.ui.fn.getPlayerColor(this.game, player)

        if (!this.game.settings.chooseColors) {
          classes.push(`${color}-element`)
        }
      }
      else if (line.text.includes(' plays ')) {
        classes.push('player-action')
        classes.push('play-a-card')
      }
      else if (line.text.endsWith(' recruit')) {
        classes.push('player-action')
        classes.push('recruit-action')
      }
      else if (line.text.includes(' power: ')) {
        classes.push('player-action')
        classes.push('power-action')
      }
      else if (line.text.endsWith(' passes')) {
        classes.push('player-action')
        classes.push('pass-action')
      }
      else {
        classes.push('generic')
      }

      return classes
    },

    styles(line) {
      if (this.game.settings.chooseColors && line.classes && line.classes.includes('player-turn')) {
        const playerName = line.args.player.value
        const player = this.game.getPlayerByName(playerName)
        return {
          'background-color': player.color,
        }
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
}

.indent-spacer::before {
  content: "|\00A0";
}

.indent-0 {
  font-weight: bold;
  width: 100%;
  text-align: center;
  border-radius: .5em;
  margin-top: 2em;
  line-height: 2em;
}

.indent-0.generic {
  color: #eee;
  background-color: purple;
}

.player-action {
  padding: 5px 10px;
  border-radius: 3px;
}

.player-action.recruit-action {
  background-color: #e8b687;
}

.player-action.play-a-card {
  background-color: #e8d987;
}

.player-action.power-action {
  background-color: #e8c887;
}

.player-action.pass-action {
  background-color: #c96d2c;
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
