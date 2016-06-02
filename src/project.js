const EventEmitter = require('events').EventEmitter;
const PathHelper = require('./lib/utilities/path-helper');
const TabFile = require('./lib/files/tab');
const AdfFile = require('./lib/files/adf');
const HashNamesFile = require('./lib/files/hash-names');
const Project = require('./project');
const fs = require('fs');
const async = require('async');

module.exports = class Project extends EventEmitter {
    constructor(path){
        super();

        this.path = path;
        this.tabFiles = [];
        this.hashNamesFiles = [];
    }

    glob(patterns, fn){
        return PathHelper.glob(this.path, patterns, fn);
    }

    loadDataFiles(fn){
        async.parallel({
            tabFiles: this.loadTabFiles.bind(this),
            hashNamesFiles: this.loadHashNamesFiles.bind(this)
        }, (err, data) => {
            if(err)
                return fn(err);

            this.hashNamesFiles = data.hashNamesFiles;
            this.tabFiles = data.tabFiles;
            fn();
        });
    }

    loadTabFiles(fn){
        this.glob('**/*.tab', (err, paths) => {
            if(err)
                return fn(err);
            async.map(paths, fs.readFile, (err, data) => {
                if(err)
                    return fn(err);
                return fn(null, data.map(buffer => TabFile.deserialize(buffer)));
            });
        });
    }

    loadHashNamesFiles(fn){
        this.glob('**/*_hash_names*.txt', (err, paths) => {
            if(err)
                return fn(err);
            async.map(paths, fs.readFile, (err, data) => {
                if(err)
                    return fn(err);
                return fn(null, data.map(buffer => HashNamesFile.deserialize(buffer)));
            });
        });
    }
};
