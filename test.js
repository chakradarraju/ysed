const {readFileSync} = require('fs');
const path = require('path');

function readUpdates(config) {
    if (!config) return [];
    const updates = readFileSync(config, 'utf8').split('\n').map(line => line.trim()).filter(line => !!line.length);
    console.log(updates);
}

function basepath(url) {
    console.log(path.dirname(url));
}

basepath('../.././chakra.json');