<template>
  <div class="settings-pack-draft">

    <div class="set-picker-div">
      <div class="form-label">Set: {{ selectedSet }}</div>
      <button class="btn btn-secondary" @click="openSetPicker">Open Set Picker</button>
    </div>

    <label class="form-label">Number of Packs</label>
    <input class="form-control" v-model.number="options.numPacks" @change="optionsChanged" />

    <SetPickerModal :id="setPickerModalId" @set-selected="selectSet" />
  </div>
</template>


<script>
import { mag, util } from 'battlestar-common'
import { v4 as uuidv4 } from 'uuid'

import SetPickerModal from '@/modules/magic/components/SetPickerModal'


export default {
  name: 'SetDraftSettings',

  components: {
    SetPickerModal,
  },

  inject: ['lobby', 'save'],

  data() {
    return {
      options: {},

      users: [],

      setPickerModalId: 'set-picker-modal-' + uuidv4(),
    }
  },

  computed: {
    selectedSet() {
      return this.options.set ? this.options.set.name : 'none'
    },
  },

  watch: {
    'lobby.users': {
      handler() {
        this.updateValid()
      },
      deep: true,
    },
  },

  methods: {
    async fetchUsers() {
      const { users } = await this.$post('/api/user/all')
      this.users = users.sort((l, r) => l.name.localeCompare(r.name))
      this.updateValid()
    },

    // Called by both optionsChanged, and a watcher on users in the lobby.
    updateValid() {
      const opts = this.lobby.options

      const numPlayersCondition = this.lobby.users.length >= 2
      const numPacksCondition = opts.numPacks > 0
      const setSelectedCondition = opts.set && ['expansion', 'core', 'draft_innovation', 'masters'].includes(opts.set.set_type)

      this.lobby.valid = (
        numPlayersCondition
        && numPacksCondition
        && setSelectedCondition
      )
    },

    optionsChanged() {
      this.lobby.options = util.deepcopy(this.options)
      this.updateValid()
      this.save()
    },

    async makePacks(lobby) {
      const setCode = this.lobby.options.set.code

      const cards = this
        .$store
        .getters['magic/cards/all']
        .filter(c => c.set === setCode)
        .filter(c => !c.type_line.includes('Basic'))

      const rarityPools = util.array.collect(cards, c => c.rarity)

      const totalPacks = this.lobby.users.length * this.lobby.options.numPacks

      const getCards = (rarity, count) => util.array.selectMany(rarityPools[rarity], count)

      let index = 0
      const packs = []
      while (packs.length < totalPacks) {
        const pack = []

        // One rare or mythic card
        // About 1 out of 7.4 rare slots have a mythic.
        if (rarityPools['mythic'] && Math.random() < .135) {
          getCards('mythic', 1).forEach(card => pack.push(card))
        }
        else {
          getCards('rare', 1).forEach(card => pack.push(card))
        }

        getCards('uncommon', 3).forEach(card => pack.push(card))
        getCards('common', 10).forEach(card => pack.push(card))

        console.log(pack)

        const simplified = pack.map(card => {
          index += 1
          return {
            id: card.name + `(${index})`,
            name: card.name,
            set: card.set,
            collector_number: card.collector_number,
          }
        })
        packs.push(simplified)
      }

      lobby.packs = packs
      lobby.options.packSize = packs[0].length
    },

    openSetPicker() {
      this.$modal(this.setPickerModalId).show()
    },

    selectSet(sett) {
      this.options.set = sett
      this.optionsChanged()
    },

    defaultOptions() {
      return {
        numPacks: 3,
      }
    },
  },

  created() {
    this.lobby.onStart = this.makePacks

    if (!this.lobby.options) {
      // Initialize with default options
      this.options = this.defaultOptions()
      this.lobby.options = this.defaultOptions()
      this.updateValid()
    }
    else {
      // Load the saved options into the selected options
      this.options = Object.assign(this.defaultOptions(), this.lobby.options)
      this.optionsChanged()
    }

    this.fetchUsers()
  },
}
</script>


<style scoped>
</style>
