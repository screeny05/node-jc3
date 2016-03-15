const PathHelper = require('./lib/utilities/path-helper');
const TabFile = require('./lib/files/tab');
const AdfFile = require('./lib/files/adf');
const HashNamesFile = require('./lib/files/hash-names');
const Project = require('./project');
const fs = require('fs');

PathHelper.tryGetInstallPath((err, path) => {
    if(err || !path)
        path = '/Users/screeny/src/Just Cause 3';

    let currentProject = new Project(path);
    currentProject.loadDataFiles(()=>{});
});

//PathHelper.tryGetInstallPath((err, path) => PathHelper.glob('/Users/screeny/src/', ['**/*.shader_bundle'], (err, paths) => {
    //paths.forEach(path => fs.readFile(path, (err, buffer) => {
        //try {
            //fs.writeFileSync(JSON.stringify('data.json', AdfFile.deserialize(buffer), true, "  "), 'utf8');
        //} catch(e){}
    //}));
    //fs.readFile(paths[0], (err, buffer) => console.log(AdfFile.deserialize(buffer)));
//}));
