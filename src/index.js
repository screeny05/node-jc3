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

let hashNamesFile = '/Users/screeny/src/Just Cause 3/archives_win64/game_hash_names0.txt';
let tabFile = '/Users/screeny/src/Just Cause 3/archives_win64/game0.tab';
let arcFile = '/Users/screeny/src/Just Cause 3/archives_win64/game0.arc';

let hashNamesStream = fs.createReadStream(hashNamesFile);
let hashNamesCorrode = Corrode().ext.hashNamesTable().pushVars();


hashNamesStream.pipe(hashNamesCorrode);
hashNamesCorrode.on('finish', function(){
    let tabStream = fs.createReadStream(tabFile);
    let tabCorrode = Corrode().ext.tab('values', hashNamesCorrode.vars).pushVars();

    tabStream.pipe(tabCorrode);
    tabCorrode.on('finish', function(){
        let arcStream = fs.createReadStream(arcFile);
        let arcCorrode = Corrode().ext.arcEntry('values', tabCorrode.vars[2]).pushVars();

        arcStream.pipe(arcCorrode);
        arcCorrode.on('finish', function(){
            let adfData = arcCorrode.vars.data;
            let adfCorrode = Corrode().ext.adf('values').pushVars();

            adfCorrode.write(adfData);
            console.log(adfCorrode.vars.instanceTable[0]);
        });
    });
});





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
