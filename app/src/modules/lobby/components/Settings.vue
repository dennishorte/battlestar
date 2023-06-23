<template>
  <div class="lobby-settings">
    <div class="section-heading">
      Settings
    </div>

    <div class="game-picker" v-if="lobby">
      <select class="form-select" @change="gameChanged" :value="lobby.game">
        <option v-for="name in gameNames" :key="name" :value="name">{{ name }}</option>
      </select>
    </div>

    <div class="game-options mt-2">
      <SettingsInnovation v-if="lobby.game === 'Innovation'" />
      <SettingsTyrants v-if="lobby.game === 'Tyrants of the Underdark'" />

      <SettingsMagic v-if="lobby.game === 'Magic'" />
      <SettingsCubeDraft v-if="lobby.game === 'Cube Draft'" />
      <SettingsSetDraft v-if="lobby.game === 'Set Draft'" />
    </div>
  </div>
</template>


<script>
import SettingsCubeDraft from './SettingsCubeDraft'
import SettingsInnovation from './SettingsInnovation'
import SettingsMagic from './SettingsMagic'
import SettingsSetDraft from './SettingsSetDraft'
import SettingsTyrants from './SettingsTyrants'


export default {
  name: 'Settings',

  components: {
    SettingsCubeDraft,
    SettingsInnovation,
    SettingsMagic,
    SettingsSetDraft,
    SettingsTyrants,
  },

  inject: ['lobby', 'save'],

  data() {
    return {
      gameNames: [
        '',
        'Innovation',
        'Tyrants of the Underdark',

        'Magic',
        'Cube Draft',
        'Set Draft',
      ],
    }
  },

  methods: {
    gameChanged(event) {
      const newValue = event.target.value
      if (newValue) {
        this.lobby.game = newValue
        delete this.lobby.options
        this.save()
      }
    },
  },
}
</script>
