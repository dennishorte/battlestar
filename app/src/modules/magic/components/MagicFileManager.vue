<template>
  <div v-if="loading" class="alert alert-warning">Loading file data...</div>

  <FileManager
    v-else
    :filelist="filelist"
    :file-types="['card', 'cube', 'deck']"
    @file-creating="createFile"
    @file-deleting="deleteFile"
    @file-duplicating="duplicateFile"
    @file-opening="openFile"
    @file-updating="updateFile"
  />
</template>


<script>
import axios from 'axios'
import { mapState } from 'vuex'

import FileManager from '@/components/filemanager/FileManager'
import Header from '@/components/Header'


export default {
  name: 'MagicFileManager',

  components: {
    FileManager,
    Header,
  },

  data() {
    return {
      loading: true,
    }
  },

  computed: {
    ...mapState('magic', {
      filelist: 'filelist',
    })
  },

  methods: {
    createFile(data) {
      this.$store.dispatch('magic/createFile', data)
    },

    deleteFile(data) {
      this.$store.dispatch('magic/deleteFile', data)
    },

    duplicateFile(data) {
      this.$store.dispatch('magic/duplicateFile', data)
    },

    openFile(data) {
      console.log('open', data)
    },

    updateFile(data) {
      this.$store.dispatch('magic/updateFile', data)
    },
  },

  async mounted() {
    await this.$store.dispatch('magic/loadFiles')
    this.loading = false
  },
}
</script>
