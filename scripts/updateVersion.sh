set -o allexport
source ./api/.env
set +o allexport

node scripts/_updateVersion.js
