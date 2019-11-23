#!/usr/bin/env node

const yaml = require('yaml');
const {readFileSync} = require('fs');

function envUpdateKey(str) {
    const res = /^env\((.*)\)$/.exec(str);
    return res ? res[1] : null;
}

function parseUpdate(arg) {
    const parts = arg.split('=');
    if (parts.length !== 2) {
        console.error('Unable to understand update', arg);
        return null;
    }
    const envUpdate = envUpdateKey(parts[0]);
    if (envUpdate) return {
        env: envUpdate,
        value: parts[1]
    };
    return {
        path: parts[0],
        value: parts[1]
    }
}

function set(doc, path, value) {
    if (path.length === 1) {
        console.log('Setting', value, 'in', doc.toJSON());
        doc.set(path[0], value);
        return;
    }
    var key = path.shift();
    var index = null;
    if (!doc.has(key)) {
        const r = /^(.*)\[(\d+)\]$/;
        const res = r.exec(key);
        if (!res || !doc.has(res[1]) || !doc.get(res[1]).has(parseInt(res[2]))) {
            console.log('Unable to find', key, 'in doc', doc.toJSON());
            return;    
        } else {
            key = res[1];
            index = parseInt(res[2]);
        }
    }
    const newDoc = index === null ? doc.get(key) : doc.get(key).get(index);
    set(newDoc, path, value);
}

function unravel(doc) {
    if (!doc || doc.type !== 'SEQ') return [];
    return doc.items;
}

function flat(arr) {
    if (!Array.isArray(arr)) return arr;
    return arr.reduce((c, i) => c.concat(i), []);
}

function find(doc, key) {
    const directItem = doc.get(key);
    var recursiveItems = [];
    if (doc.type === 'MAP') {
        recursiveItems = flat(doc.items.filter(item => item.value.type === 'MAP').map(item => find(item.value, key)));
    }
    return unravel(directItem).concat(recursiveItems);
}

function findEnvs(doc) {
    return flat(find(doc, 'containers').map(container => unravel(container.get('env'))));
}

function updateEnv(root, env, value) {
    findEnvs(root).forEach(envMap => {
        if (envMap.get('name') === env) envMap.set('value', value);
    });
}

function update(doc, updateOp) {
    if (updateOp.hasOwnProperty('env')) {
        updateEnv(doc.contents, updateOp.env, updateOp.value);
    } else if (updateOp.hasOwnProperty('path')) {
        const parts = updateOp.path.split('.');
        set(doc, parts, updateOp.value);            
    }
}

if (process.argv.length < 3) {
    console.error('Pass yaml file to process');
    process.exit(1);
}

console.log('Reading file', process.argv[2]);
const docs = yaml.parseAllDocuments(readFileSync(process.argv[2], 'utf8'));
for (var i = 3; i < process.argv.length; i++) {
    docs.forEach(doc => update(doc, parseUpdate(process.argv[i])));
}
console.log(yaml.stringify(docs));
