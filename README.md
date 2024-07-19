How to set up the database
=====

1. Install mongodb
2. Create an admin user with roles ['userAdminAnyDatabase', 'readWriteAnyDatabase']
3. Add the following fields into a .env file in both the api/ and app/ folders.

```
DB_HOST='localhost'
DB_PORT='27017'
DB_USER='admin'
DB_PASS='adminpassword'
```

Note that it is not best practice for the admin user to have both of these roles.


Additional .env parameters
=====
```
SECRET_KEY='my_secret_key'               # This can be anything. Used by express.
SLACK_BOT_TOKEN='my_slack_bot_token'
DOMAIN_HOST='localhost:8080'             # This should be the actual serving host.
```


Running Locally
=====
In the `api/` folder, run `npm run dev`.
In the `app/` folder, run `npm run serve`.
