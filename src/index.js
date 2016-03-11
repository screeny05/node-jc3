const PathHelper = require('./lib/utilities/path-helper');
const TabFile = require('./lib/files/tab');
const AdfFile = require('./lib/files/adf');
const HashNamesFile = require('./lib/files/hash-names');
const Project = require('./project');
const fs = require('fs');


let proj = new Project();

//PathHelper.tryGetInstallPath((err, path) => PathHelper.glob(path, '**/*.tab', (err, paths) => {
//    paths.forEach(path => fs.readFile(path, (err, buffer) => TabFile.deserialize(buffer)));
//    fs.readFile(paths[0], (err, buffer) => {
//        let file = TabFile.deserialize(buffer);
//        let copyFile = TabFile.deserialize(TabFile.serialize(file));
//        console.log('eq', require('lodash').isEqual(file, copyFile));
//    });
//}));
//
//PathHelper.tryGetInstallPath((err, path) => PathHelper.glob(path, '**/*_hash_names*.txt', (err, paths) => {
//    paths.forEach(path => fs.readFile(path, (err, buffer) => TabFile.deserialize(buffer)));
//    fs.readFile(paths[0], (err, buffer) => console.log(HashNamesFile.deserialize(buffer)));
//}));

PathHelper.tryGetInstallPath((err, path) => PathHelper.glob('./Just Cause 3', ['**/*.shader_bundle'], (err, paths) => {
    paths.forEach(path => fs.readFile(path, (err, buffer) => {
        try {
            console.log(path, AdfFile.deserialize(buffer));
        } catch(e){}
    }));
    //fs.readFile(paths[0], (err, buffer) => console.log(AdfFile.deserialize(buffer)));
}));

console.log(require('dissolve')().pipe);
