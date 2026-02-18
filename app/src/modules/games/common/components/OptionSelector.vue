<template>
  <div class="option-selector">

    <div
      :class="[
        'option-name',
        isValid ? '' : 'invalid-selection'
      ]">
      {{ displayName }} {{ rangeString }}
    </div>

    <div v-if="selector.help" class="selector-help">{{ selector.help }}</div>

    <div class="option-checkboxes">
      <div v-for="(option, index) in selector.choices" :key="index">
        <div v-if="!optionHasChildren(option)" class="input-row">
          <input type="checkbox" :value="index" v-model="selected" />

          <div class="spacer" />

          <div @mouseenter="mouseEntered(option)" @mouseleave="mouseExited(option)" class="input-wrapper">
            <div class="input-label">
              <OptionName :option="option" />
            </div>

            <div class="subtitle" v-for="(subtitle, index) in option.subtitles" :key="index">
              {{ subtitle }}
            </div>
          </div>

        </div>


        <div class="nested-options" v-else>
          <input type="checkbox"
                 :value="index"
                 v-model="selected"
                 disabled />
          <OptionSelector :owner="owner" :selector="option" @selection-changed="childChanged" />
        </div>
      </div>

    </div>

  </div>
</template>


<script>
import { selector, util } from 'battlestar-common'

import OptionName from './OptionName.vue'

export default {
  name: 'OptionSelector',

  components: {
    OptionName,
  },

  inject: ['actor', 'game', 'bus'],

  emits: ['selection-changed'],

  props: {
    required: {
      type: Boolean,
      default: false,
    },
    selector: {
      type: Object,
      default: null,
    },
    owner: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      childInfo: {},

      // The physically selected checkboxes in this option selector (by index)
      selected: [],
    }
  },

  computed: {
    selectorTitle() {
      return this.selector.title
    },

    displayName() {
      return `${this.selectorTitle}`
    },

    isValid() {
      return selector.validate(this.selector, this.selection).valid
    },

    max() {
      return selector.minMax(this.selector).max
    },

    min() {
      return selector.minMax(this.selector).min
    },

    rangeString() {
      if (this.min === this.max) {
        return `[${this.min}]`
      }
      else {
        return `[${this.min}..${this.max}]`
      }
    },

    selection() {
      const selectedOptions = []
      for (let i = 0; i < this.selector.choices.length; i++) {
        const opt = this.selector.choices[i]
        const title = this.optionDisplayName(opt)
        const isSelected = this.selected.includes(i)
        if (isSelected) {
          if (this.optionHasChildren(opt)) {
            // This case comes up when selectors change.
            // Since the whole OptionSelector isn't reloaded from scratch, there is
            // leftover state whose order of recalculation can cause problems.
            if (this.childInfo[title] === undefined) {
              continue
            }
            selectedOptions.push(this.childInfo[title])
          }
          else {
            selectedOptions.push(title)
          }
        }
      }
      return {
        title: this.selectorTitle,
        selection: selectedOptions
      }
    },

    subtitles() {
      return this.selector.subtitles || []
    }
  },

  watch: {
    selection() {
      this.notifyParent()
    },

    selector() {
      this.clearSelection()
    },
  },

  methods: {
    mouseEntered(data) {
      this.bus.emit('waiting-mouse-entered', data)
    },

    mouseExited(data) {
      this.bus.emit('waiting-mouse-exited', data)
    },

    optionDisplayName(option) {
      return option.title ? option.title : option
    },

    optionHasChildren(option) {
      return Array.isArray(option.choices)
    },

    childChanged(event) {
      const childIndex = this
        .selector
        .choices
        .findIndex(o => this.optionDisplayName(o) === event.title)

      if (event.isChecked) {
        this.childInfo[event.title] = event
        util.array.pushUnique(this.selected, childIndex)
      }
      else {
        delete this.childInfo[event.title]
        util.array.remove(this.selected, childIndex)
      }
    },

    clearSelection() {
      this.selected = []
    },

    // Need to share our selected info upwards
    notifyParent() {
      const copy = util.deepcopy(this.selection)
      copy.isChecked = this.selected.length > 0
      this.$emit('selection-changed', copy)
    },

    setSelection(optionName, opts={}) {
      this.selected = []

      optionName = optionName.toLowerCase()

      for (let i = 0; i < this.selector.choices.length; i++) {
        const choice = this.selector.choices[i]
        const choiceName = (choice.title || choice).toLowerCase()
        if (choiceName === optionName || (opts.prefix && choiceName.startsWith(optionName))) {
          this.selected.push(i)
        }
      }
    },

    setSelectionFromEvent({ actor, optionName, opts }) {
      if (!actor) {
        throw new Error('Must specify actor')
      }
      if (actor._id !== this.owner._id) {
        return
      }
      if (!opts) {
        opts = {}
      }
      this.setSelection(optionName, opts)
    },
  },

  created() {
    this.bus.on('user-select-option', this.setSelectionFromEvent)
  },
}
</script>


<style scoped>
input[type='checkbox'] {
  width: 1.5rem;
  height: 1.5rem;
  min-width: 1.5rem;
  min-height: 1.5rem;
}

.input-label {
  vertical-align: top;
  min-width: 100%;
}

.input-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.input-wrapper {
  flex-grow: 1;
}

.input-row, .nested-options {
  margin-bottom: 2px;
}

.invalid-selection {
  color: red;
}

.nested-options {
  display: flex;
  flex-direction: row;
}

.nested-options > input {
  margin-top: .4rem;
}

.nested-options .option-selector {
  margin-left: .4rem;
}

.option-checkboxes {
  display: flex;
  flex-direction: column;
}

.option-name {
  margin-top: .45rem;
}

.spacer {
  min-width: .3em;
  max-width: .3em;
}

.selector-help {
  font-size: .85em;
  color: gray;
  font-style: italic;
  margin-bottom: .3rem;
}

.subtitle {
  font-size: .8em;
  color: gray;
  margin-left: 8px;
  margin-top: -4px;
}
</style>
