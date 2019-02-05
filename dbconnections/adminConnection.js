const monk = require('monk');
connecionString = process.env.MONGODB_URI || 'localhost/vg-vms-E1MV-admin';
const db = monk(connecionString);

module.exports = db; // cannot export as an object
