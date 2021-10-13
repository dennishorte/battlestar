<template>
  <div class="main-receive-skills">
    <div class="description">
      <p>The active player ({{ playerName }}) draws all of the skill cards listed on his character sheet.</p>

      <p>Character: <span class="heading">{{ character.name }}</span></p>

      <ul class="list-unstyled">
        <li v-for="skill in skills" :key="skill.name">
          {{ skill.name }}: {{ skill.value }}{{ skill.optional ? '*' : '' }}
        </li>
      </ul>
    </div>

    <GameButton
      owner="current-player"
      @click="drawSkills">
      draw fixed skills for {{ playerName }}
    </GameButton>
  </div>
</template>


<script>
import GameButton from './GameButton'

import { bsg } from 'battlestar-common'


export default {
  name: 'MainReceiveSkills',

  components: {
    GameButton,
  },

  computed: {
    character() {
      const char = this.$game.getCardCharacterByPlayer(this.playerName)
      return char ? char : {}
    },

    playerName() {
      return this.$game.getPlayerCurrentTurn().name
    },

    skills() {
      if (!this.character) {
        return []
      }

      const output = []
      for (let skill of bsg.util.skillList) {
        skill = skill.toLowerCase()
        const charSkill = this.character[skill]
        if (charSkill) {
          const optional = charSkill.slice(-1) === '*'
          const value = parseInt(charSkill)

          output.push({
            name: skill,
            value,
            optional,
          })
        }
      }

      return output
    },
  },

  methods: {
    drawSkills() {
      console.log('draw skills')
    },
  },
}
</script>


<style scoped>
.description {
  color: #444;
  font-size: .7em;
}
</style>
