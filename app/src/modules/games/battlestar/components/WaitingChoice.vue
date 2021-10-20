<template>
  <div class="waiting-choice">

    <OptionSelector :selector="action" :required="true" @selection-changed="updateSelection" />

    <GameButton :owner="actor" @click="submit" :disabled="!isValid">
      choose
    </GameButton>

  </div>
</template>


<script>
import GameButton from './GameButton'
import OptionSelector from './OptionSelector'

export default {
  name: 'WaitingChoice',

  components: {
    GameButton,
    OptionSelector,
  },

  props: {
    actor: String,
    action: Object,
  },

  data() {
    return {
      isValid: false,
      selection: {},
    }
  },

  methods: {
    makeCheckboxOptions(stringOptions) {
      return stringOptions.map((o, index) => ({ text: o, value: index }))
    },

    async submit() {
      this.$game.submit({
        actor: this.actor,
        name: this.action.name,
        option: this.selection.option,
      })
      this.selection = {}
      this.isValid = false
      await this.$game.save()
    },

    updateSelection(selection) {
      this.selection = _cleanResponse(selection)
      this.isValid = _checkValidRecursively(selection)
    },
  },
}


function _checkValidRecursively(selection) {
  if (typeof selection === 'string') {
    return true
  }
  else if (!selection.isValid) {
    return false
  }
  else {
    return selection.options.every(s => _checkValidRecursively(s))
  }
}

function _cleanResponse(response) {
  const output = {}
  output.name = response.name
  output.option = []
  for (let i = 0; i < response.options.length; i++) {
    if (response.selected.includes(i)) {
      const selection = response.options[i]
      if (typeof selection === 'string') {
        output.option.push(selection)
      }
      else {
        output.option.push(_cleanResponse(selection))
      }
    }
  }
  return output
}
</script>


<style scoped>
.action-name {
  font-weight: bold;
  text-align: center;
}
</style>
