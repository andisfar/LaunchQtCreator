import * as Mocha from 'mocha';
import * as path from 'path';
import * as fs from 'fs';

// Instantiate a Mocha instance.
const mocha = new Mocha({
    ui: 'bdd'
});

const testDir = path.resolve(__dirname);

// Add each .test.ts file to the Mocha instance
fs.readdirSync(testDir)
    .filter(file => file.endsWith('.test.ts'))
    .forEach(file => {
        mocha.addFile(path.join(testDir, file));
    });

// Run the tests.
mocha.run(failures => {
    process.exitCode = failures ? 1 : 0;
});
