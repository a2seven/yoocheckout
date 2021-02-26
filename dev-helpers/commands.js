#!/usr/bin/env node

const { success, warning, info, error } = require('./console');
const args = process.argv.slice(2);
console.log('\n');
success('YooCheckout dev CLI.');
console.log('\n');


const printCommands = () => {
    info('-------------------');
    warning('DEV');
    info('-------------------\n');
    success('helper b');
    success('helper builder\n');
    console.log('Build package\n');
    info('-------------------\n');
    success('helper b update-v');
    success('helper builder update-v\n');
    console.log('Build package and Update package version\n');
    info('-------------------\n');
    success('helper b update-v-alpha');
    success('helper builder update-v-alpha\n');
    console.log('Build package and Update package version and set ALPHA\n');
    info('-------------------');
}

switch (args[0]) {
    case 'b':
    case 'builder':
        const builder = require('./builder');
        args.shift()
        builder.exe(args);
        break;
    default:
        error('Unknown command.')
        printCommands();
        process.exit(0)
}