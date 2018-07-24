const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

module.exports = function (bundler) {
    const maninfestOutput = process.env.MANINFEST_OUTPUT_DIR && path.resolve(process.env.MANINFEST_OUTPUT_DIR);
    const defaultFileName = process.env.MANINFEST_FILENAME || "resources-maninfest.json";
    const maninfest = {};

    function processBundle(bundle) {
        const bundleName = bundle.name;
        const hash = crypto.createHash("md5");
        const fstream = fs.ReadStream(bundle.name);

        fstream.on('data', function(data) {
            hash.update(data)
        });
        fstream.on('end', function() {
            const digest = hash.digest('hex');
            maninfest[bundle.name] = digest;
        });
    }

    bundler.on('bundled', (bundle) => {
        const outDir = maninfestOutput || bundle.entryAsset.options.outDir;
        const outFile = path.resolve(outDir, defaultFileName);

        processBundle(bundle);
        console.log(maninfest);
    });
};
