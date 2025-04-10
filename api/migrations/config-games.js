require('dotenv').config('../../.env')

const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT


module.exports = {
  mongodb: {
    url: `mongodb://${DB_HOST}:${DB_PORT}`,
    databaseName: "games",

    options: {
      auth: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
      },
      //   useNewUrlParser: true // removes a deprecation warning when connecting
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    },
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: "migrations/games",

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: "changelog",

  // The file extension to create migrations and search for in migration dir
  migrationFileExtension: ".js",

  // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determin
  // if the file should be run.  Requires that scripts are coded to be run multiple times.
  useFileHash: false,

  // The mongodb collection where the lock will be created.
  lockCollectionName: "changelog_lock",

  // The value in seconds for the TTL index that will be used for the lock. Value of 0 will disable the feature.
  lockTtl: 0,

  moduleSystem: "commonjs",
}
