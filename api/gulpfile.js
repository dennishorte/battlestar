import { src, dest, series, parallel } from 'gulp'
import { deleteAsync } from 'del'
import fs from 'fs'
import zip from 'gulp-zip'
import log from 'fancy-log'
import webpack_stream from 'webpack-stream'
import webpack_config from './webpack.config.js'
import { exec as execCallback } from 'child_process'
import { promisify } from 'util'

const exec = promisify(execCallback)

const paths = {
  prod_build: '../prod-build',
  server_file_name: 'server.bundle.js',
  vue_src: '../app/build/**/*',
  vue_dist: '../prod-build/app/build',
  zipped_file_name: 'vue-nodejs.zip'
}

function clean()  {
  log('removing the old files in the directory')
  return deleteAsync('../prod-build/**', {force:true})
}

function createProdBuildFolder() {

  const dir = paths.prod_build
  log(`Creating the folder if not exist  ${dir}`)
  if(!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
    log('📁  folder created:', dir)
  }

  return Promise.resolve('the value is ignored')
}

async function buildVueCodeTask() {
  log('building Vue code into the directory')
  try {
    const { stdout, stderr } = await exec('cd ../app && npm run build')
    log(stdout)
    log(stderr)
  }
  catch (err) {
    log.error(err)
    throw err
  }
}

function copyVueCodeTask() {
  log('copying Vue code into the directory')
  return src(`${paths.vue_src}`)
    .pipe(dest(`${paths.vue_dist}`))
}

function copyNodeJSCodeTask() {
  log('building and copying server code into the directory')
  return webpack_stream(webpack_config)
    .pipe(dest(`${paths.prod_build}`))
}

function zippingTask() {
  log('zipping the code ')
  return src(`${paths.prod_build}/**`)
    .pipe(zip(`${paths.zipped_file_name}`))
    .pipe(dest(`${paths.prod_build}`))
}

export default series(
  clean,
  createProdBuildFolder,
  buildVueCodeTask,
  parallel(copyVueCodeTask, copyNodeJSCodeTask),
  zippingTask
)
