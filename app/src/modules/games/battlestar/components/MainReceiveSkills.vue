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

    <b-button @click="drawSkills" variant="primary" block>draw fixed skills for {{ playerName }}</b-button>
  </div>
</template>


<script>
import { skillList } from '../lib/util.js'


export default {
  name: 'MainReceiveSkills',

  computed: {
    character() {
      const char = this.$store.getters['bsg/playerCharacter'](this.playerName)
      return char ? char : {}
    },

    playerName() {
      return this.$store.getters['bsg/playerActive']
    },

    skills() {
      if (!this.character) {
        return []
      }

      const output = []
      for (let skill of skillList) {
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
      const kinds = []
      for (const { name, value, optional } of this.skills) {
        if (optional)
          continue

        for (let i = 0; i < value; i++) {
          kinds.push(name)
        }
      }

      this.$store.dispatch('bsg/drawSkills', {
        playerName: this.playerName,
        kinds,
      })
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
