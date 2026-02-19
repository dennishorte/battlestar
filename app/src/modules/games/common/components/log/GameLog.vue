<template>
  <div class="gamelog" ref="gamelog" :class="nestedClasses">
    <template v-if="nested || gameReady">
      <ChatOffCanvas :colors="chatColors" v-if="!nested" />
      <NotesOffCanvas v-if="!nested" />

      <template v-for="(line, index) in lines" :key="index">

        <div v-if="line.type === 'nest'">
          <GameLog :entries="line.entries" :depth="line.depth" />
        </div>

        <div v-else
             class="log-line"
             :class="[line.classes, lineClasses(line)]"
             :style="lineStyles(line)">
          <template v-if="line.type === 'chat'">
            <div class="chat-container">
              <div class="chat-message">
                <div>
                  <span class="chat-author">{{ line.author }}:</span>
                  {{ line.text }}
                </div>
                <div class="chat-delete" @click="deleteChat(line)" v-if="line.id">
                  <i class="bi bi-x-circle"/>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <component v-if="getLineComponent(line)" :is="getLineComponent(line)" :line="line" />
            <template v-else>
              <div v-for="n in indentSpacers(line)" :key="n" class="indent-spacer" />
              <GameLogText :text="line.text" />
            </template>
          </template>
        </div>

      </template>

      <RematchButton v-if="rematchButtonVisible" />

      <div class="bottom-space" v-if="!nested"/>

      <ChatInput id="chat-input-main" :save-on-chat="saveOnChat" v-if="!nested" />
    </template>
  </div>
</template>

<script>
export default { name: 'GameLog' }
</script>

<script setup>
import { ref, computed, watch, inject, nextTick, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useGameLog } from '../../composables/useGameLog'
import ChatInput from '@/modules/games/common/components/ChatInput.vue'
import ChatOffCanvas from '@/modules/games/common/components/log/ChatOffCanvas.vue'
import GameLogText from '@/modules/games/common/components/log/GameLogText.vue'
import NotesOffCanvas from '@/modules/games/common/components/log/NotesOffCanvas.vue'
import RematchButton from '@/modules/games/common/components/RematchButton.vue'

const props = defineProps({
  depth: {
    type: Number,
    default: 0,
  },

  entries: {
    type: Array,
    default: null,
  },

  saveOnChat: {
    type: Boolean,
    default: true,
  },

  showRematchButton: {
    type: Boolean,
    default: true,
  },
})

const game = inject('game')
const store = useStore()
const funcs = useGameLog()
const gamelog = ref(null)

const chatColors = computed(() => {
  return funcs.chatColors ? funcs.chatColors() : {}
})

const lines = computed(() => {
  if (props.entries) {
    return props.entries
  }
  else if (game.value?.log) {
    return nestLog(game.value.log.merged()).output
  }
  else {
    return []
  }
})

const gameReady = computed(() => !!game.value?.log)

const nested = computed(() => props.depth > 0)

const nestedClasses = computed(() => [
  'nested',
  `nested-${props.depth}`,
])

const rematchButtonVisible = computed(() => {
  return props.showRematchButton && game.value?.gameOver && !nested.value
})

function convertLogMessage(entry) {
  let msg = entry.template
  for (const [arg, value] of Object.entries(entry.args)) {
    let replacement = value.value

    if (arg === 'card') {
      if (value.classes?.includes('card-hidden')) {
        replacement = value.value
      }
      else if (!value.value.startsWith('*')) {
        replacement = `card(${value.cardId || value.value})`
      }
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
}

function nestLog(entries, depth = 0) {
  const output = []
  let count = 0

  for (let i = 0; i < entries.length; i++) {
    count += 1

    const entry = entries[i]

    if (entry.type === 'response-received') {
      // do nothing
    }
    else if (entry.type === 'chat') {
      output.push(entry)
    }
    else {
      const displayEntry = applyVisibility(entry)
      const text = convertLogMessage(displayEntry)
      const line = {
        text,
        classes: displayEntry.classes || [],
        args: displayEntry.args,
        indent: displayEntry.indent,
        event: displayEntry.event,
      }

      if (line.event === 'stack-push') {
        const result = nestLog(entries.slice(i + 1), depth + 1)
        const nestedEntries = result.output

        i += result.consumed
        count += result.consumed
        nestedEntries.splice(0, 0, line)

        output.push({
          type: 'nest',
          depth: depth + 1,
          entries: nestedEntries,
        })
      }
      else if (line.event === 'stack-pop') {
        output.push(line)
        break
      }
      else {
        output.push(line)
      }
    }
  }
  return { output, consumed: count }
}

function applyVisibility(entry) {
  if (entry.visibility && !entry.visibility.includes(game.value.viewerName)) {
    return {
      ...entry,
      template: entry.redacted || entry.template,
    }
  }
  return entry
}

function lineClasses(line) {
  if (funcs.lineClasses) {
    return funcs.lineClasses(line)
  }
}

function lineStyles(line) {
  if (funcs.lineStyles) {
    return funcs.lineStyles(line)
  }
}

function deleteChat(line) {
  game.value.log.deleteChat(line.id)
  store.dispatch('game/save')
}

function getLineComponent(line) {
  if (funcs.lineComponent) {
    return funcs.lineComponent(line)
  }
  return null
}

function indentSpacers() {
  return 0
}

function scrollToBottom() {
  nextTick(() => {
    const elem = gamelog.value
    if (elem) {
      elem.scrollTo({
        top: 99999,
        behavior: 'smooth',
      })
    }
  })
}

watch(lines, () => {
  scrollToBottom()
  window.scrollTo(0, 0)
}, { flush: 'post', deep: true })

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.gamelog {
  --log-indent-unit: 1em;
  font-size: .8rem;
  overflow-y: auto;
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
  display: flex;
  flex-direction: row;
  align-items: center;
}
.chat-author {
  font-size: .8em;
  line-height: .5em;
  margin-top: -.5em;
}
.chat-delete {
  margin-left: .5em;
}

.log-line {
  display: flex;
  flex-direction: row;
  margin-top: 1px;
  padding-left: 1em;
  width: 100%;
}

.indent-spacer::before {
  content: "…\00A0";
}

.indent-1 { margin-left: var(--log-indent-unit); }
.indent-2 { margin-left: calc(var(--log-indent-unit) * 2); }
.indent-3 { margin-left: calc(var(--log-indent-unit) * 3); }
.indent-4 { margin-left: calc(var(--log-indent-unit) * 4); }

</style>
