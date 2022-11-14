<template>
  <div class="container">

    <div class="row">
      <div class="col">
        <FileManager :filelist="single" />
      </div>
      <div class="col">
        <FileManager :filelist="empty" />
      </div>
    </div>


    <div class="row">
      <div class="col">
        <FileManager :filelist="complex" :hide-files="true" />
      </div>
      <div class="col">
        <FileManager
          :filelist="complex"
          @file-created="fileCreated"
        />
      </div>
    </div>

  </div>
</template>


<script>
import { util } from 'battlestar-common'

import FileManager from './FileManager'


export default {
  name: 'FileManagerTest',

  data() {
    return {
      empty: [],
      single: [{
        name: 'single file',
        path: '/',
        kind: 'text'
      }],
      complex: [
        {
          name: 'bar',
          path: '/foo',
          kind: 'text',
        },
        {
          name: 'bar',
          path: '/foo',
          kind: 'text',
        },
        {
          name: 'bar',
          path: '/foo',
          kind: 'text',
        },
        {
          name: 'bar',
          path: '/foo',
          kind: 'text',
        },
        {
          name: 'bar',
          path: '/foo',
          kind: 'text',
        },
        {
          name: 'bar',
          path: '/foo',
          kind: 'text',
        },
        {
          name: 'world',
          path: '/',
          kind: 'text',
        },
      ],
    }
  },

  components: {
    FileManager,
  },

  methods: {
    fileCreated(event) {
      this.complex.push(event.file)
    },

    fileDeleted(event) {
      util.array.remove(this.complex, event.file)
    },
  },
}
</script>


<style>
.file-manager {
  min-height: 15.5rem;
  max-height: 15.5rem;
  background-color: lightgray;
  border: 1px solid gray;
  margin: .25em;
  padding: .25em;
}
</style>
