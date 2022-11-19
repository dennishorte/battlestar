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
    ...mapState('magic/file', {
      filelist: 'filelist',
    })
  },

  methods: {
    createFile(data) {
      this.$store.dispatch('magic/file/create', data)
    },

    deleteFile(data) {
      this.$store.dispatch('magic/file/delete', data)
    },

    duplicateFile(data) {
      this.$store.dispatch('magic/file/duplicate', data)
    },

    openFile(data) {
      console.log('open', data)
    },

    updateFile(data) {
      this.$store.dispatch('magic/file/update', data)
    },
  },

  async mounted() {
    console.log(this.$store)
    await this.$store.dispatch('magic/file/fetchAll')
    this.loading = false
  },
}
</script>
