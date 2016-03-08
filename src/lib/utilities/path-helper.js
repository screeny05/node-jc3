const Registry = require('winreg');
const lodash = require('lodash');
const async = require('async');
const glob = require('glob');
const path = require('path');
const fs = require('fs');

module.exports = class PathHelper {
    static REG_PATHS = {
        "\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Steam App 225540": "InstallLocation",
        "\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Steam App 225540": "InstallLocation"
    };

    static glob(cwd, patterns, fn){
        if(!Array.isArray(patterns))
            patterns = [patterns];
        async.map(patterns, (pattern, cb) => glob(path.join(cwd, pattern), cb), (err, results) =>{
            if(err)
                return fn(err);
            return fn(null, lodash.flatten(results));
        });
    }

    static tryGetInstallPath(fn){
        async.waterfall([
            fn => async.map(Object.keys(PathHelper.REG_PATHS), (key, asyncFn) => PathHelper.tryReadRegistryKey(Registry.HKLM, key, PathHelper.REG_PATHS[key], asyncFn), fn),
            (paths, fn) => fn(null, paths.filter(path => typeof path === "string")),
            (paths, fn) => async.filter(paths, fs.exists, (paths) => fn(null, paths.length > 0 ? paths[0] : null))
        ], fn);
    }

    static tryReadRegistryKey(hive, key, item, fn){
        let regKey = new Registry({ hive, key });

        regKey.get(item, (err, item) => {
            // no err thrown
            if(err)
                return fn(null);
            return fn(null, item.value);
        });
    }
};
