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
      filelist: null,
      loading: true,
    }
  },

  methods: {
    async createFile(data) {
      if (data.kind === 'cube') {
        const requestResult = await axios.post('/api/magic/cube/create', data)

        if (requestResult.data.status === 'success') {
          const cubeId = requestResult.data.cube._id
          this.$router.push(`/magic/cube/${cubeId}`)
        }
        else {
          alert(requestResult.data.message)
        }
      }

      console.log('create', data)
    },

    deleteFile(data) {
      console.log('delete', data)
    },

    duplicateFile(data) {
      console.log('duplicate', data)
    },

    openFile(data) {
      console.log('open', data)
    },

    updateFile(data) {
      console.log('update', data)
    },
  },

  mounted() {
    this.filelist = [
      {
        name: 'Red Wins',
        path: '/decks',
        kind: 'Deck',
      },
      {
        name: 'CLO',
        path: '/cubes',
        kind: 'Set',
      },
    ]
    this.loading = false
  },
}
</script>
