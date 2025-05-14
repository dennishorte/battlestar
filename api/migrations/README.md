= Migrations

* Migrations are handled via the migrate-mongo package.
* All commands should be run from the root/api folder. migrate-mongo expects the script to be run from the parent folder of 'migrations'.
* Because there are multiple databases, each one has its own config file. This means that a config file must be specified for each command.
* Migration files are using ESM format.

Create a new migration:
```
npx migrate-mongo create initial-test-structure --file migrations/test/mm-config.js
```

Run migrations for a specific database (by specifying the correct config file)
```
npx migrate-mongo up --file migrations/config-test.js
```
