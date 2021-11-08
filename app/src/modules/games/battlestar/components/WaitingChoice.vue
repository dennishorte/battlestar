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
  },

  data() {
    return {
      isValid: false,
      selection: {},
    }
  },

  computed: {
    action() {
      console.log(this.$game.getWaiting(this.actor).actions[0])
      return this.$game.getWaiting(this.actor).actions[0]
    },
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
  // The extra flag means that the player can always choose to use it,
  // and it doesn't count towards the overall selection count.
  if (selection.extra) {
    return true
  }

  // This selection has sub-choices, and will depend on them
  else if (selection.options) {
    let exclusiveChecked = false
    for (let i = 0; i < selection.options.length; i++) {
      const option = selection.options[i]
      if (option.exclusive && selection.selected.includes(i)) {
        exclusiveChecked = true
        break
      }
    }
    if (exclusiveChecked && selection.selected.length > 1) {
      return false
    }

    // It was already evaluated as invalid (probably by simple counting of selections)
    else if (!selection.isValid) {
      return false
    }

    // Since a correct number of subselections have been chosen, make sure each of them
    // is valid.
    else {
      return selection.options.every(s => _checkValidRecursively(s))
    }
  }

  // Options with no sub-choices are always valid on their own.
  else {
    return true
  }
}

function _cleanResponse(response) {
  const output = {}
  output.name = response.name
  output.option = []
  for (let i = 0; i < response.options.length; i++) {
    if (response.selected.includes(i)) {
      const selection = response.options[i]

      // If this selection is for a choice with sub-options, recursively clean
      if (selection.options) {
        output.option.push(_cleanResponse(selection))
      }

      // Otherwise, the selection is either for a string option or for an object with a name
      else {
        output.option.push(selection.name || selection)
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
