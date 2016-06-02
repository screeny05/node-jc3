//const PathHelper = require('./lib/utilities/path-helper');
//const TabFile = require('./lib/files/tab');
//const AdfFile = require('./lib/files/adf');
//const HashNamesFile = require('./lib/files/hash-names');
//const Project = require('./project');
const fs = require('fs');

const Corrode = require('./lib/corrode');
const jc3Types = require('./lib/types');


/*PathHelper.tryGetInstallPath((err, path) => {
    if(err || !path)
        path = '/Users/screeny/src/Just Cause 3';
});*/


let hashStream = fs.createReadStream('/Users/screeny/src/Just Cause 3/archives_win64/game_hash_names0.txt');
let hashCorrode = Corrode().ext.hashNamesTable().pushVars()

hashStream
    .pipe(hashCorrode)
    .on('finish', () => console.log(JSON.stringify(hashCorrode.varStack, null, 2)));



/*proj.saveArcEntry('environment/weather.adf', (err, data) => {
    err.code === 'ERRNOENTRY';
    err.code === 'ERRNODATA';
});*/

//PathHelper.tryGetInstallPath((err, path) => PathHelper.glob('/Users/screeny/src/', ['**/*.shader_bundle'], (err, paths) => {
/*    paths.forEach(path => fs.readFile(path, (err, buffer) => {
        try {
            fs.writeFileSync('data.json', JSON.stringify(AdfFile.deserialize(buffer), true, "  "), 'utf8');
        } catch(e){}
    }));
    fs.readFile(paths[0], (err, buffer) => console.log(AdfFile.deserialize(buffer)));
}));*/
