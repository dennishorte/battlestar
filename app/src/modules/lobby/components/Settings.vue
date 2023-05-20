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
      <SettingsCubeDraft v-if="lobby.game === 'Cube Draft'" />
      <SettingsInnovation v-if="lobby.game === 'Innovation'" />
      <SettingsMagic v-if="lobby.game === 'Magic'" />
      <SettingsTyrants v-if="lobby.game === 'Tyrants of the Underdark'" />
    </div>
  </div>
</template>


<script>
import SettingsCubeDraft from './SettingsCubeDraft'
import SettingsInnovation from './SettingsInnovation'
import SettingsMagic from './SettingsMagic'
import SettingsTyrants from './SettingsTyrants'


export default {
  name: 'Settings',

  components: {
    SettingsCubeDraft,
    SettingsInnovation,
    SettingsMagic,
    SettingsTyrants,
  },

  inject: ['lobby', 'save'],

  data() {
    return {
      gameNames: [
        '',
        'Cube Draft',
        'Innovation',
        'Magic',
        'Tyrants of the Underdark',
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
