const { exec } = require("child_process");
const fs = require('fs-extra');
const { success, warning, info, error } = require('./console');

const copy = (from, to) => {
    return new Promise((resolve, reject) => {
        fs.copy(from, to, err => {
            if (err) {
                error(`error: ${err.message || err}`);
                reject(err)
            }

            resolve(true);
        });
    });
}

const removeFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.remove(path, err => {
            if (err) {
                error(`error: ${err.message || err}`);
                reject(err)
            }

            resolve(true);
        });
    });
}

const cmd = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                error(`error: ${err.message}`);
                reject(err);
            }

            if (stderr) {
                warning(`WARNS: ${stderr}`);
            }

            info(`INFO: ${stdout}`);
            resolve(true);
        });
    });
}

const commandManager = (args) => {
    const actions = {
        'update-v': () => {
            info('Update package version...')
            updateV()
                .then(() => {
                    build();
                })
                .catch(() => {
                    error('Update version ERROR.');
                    process.exit(2);
                });
        },
        'default': () => {
            build()
        },
        'update-v-alpha': () => {
            info('Update package version. ALPHA...');
            updateV(true)
                .then(() => {
                    build();
                })
                .catch(() => {
                    error('Update version ERROR.');
                    process.exit(2);
                });
        }
    };

    if (!args.length || !actions[args[0]]) {
        actions['default']();
        return;
    }

    actions[args[0]]();
    return;
}

const build = async() => {
    try {
        info('Start copy files.');
        await removeFile('./npm_package/package.json');
        await copy('./lib', './npm_package/src/lib/');
        await copy('./lib', './npm_package/src/lib/');
        await copy('./README.md', './npm_package/README.md');
        success('Copy files success.');
        await copy('./npm_package/package.build.json', './npm_package/package.json');
        info('Start compile files.');
        await cmd("cd npm_package; npm i; npm run build");

        success('NPM compile finished!');
        await removeFile('./npm_package/package.json');
        await copy('./npm_package/package.prod.json', './npm_package/package.json');
        process.exit(0);
    } catch (err) {

    }
}

const updateV = (alpha = false) => {
    const updateVersion = (oldVersion) => {
        let chunks = oldVersion.split('.');

        if (chunks[chunks.length - 1].includes('alpha')) {
            if (alpha) {
                warning('The current version is an ALPHA version. Skip...');
                return oldVersion;
            };

            chunks[chunks.length - 1] = chunks[chunks.length - 1].replace('-alpha', '');
            return `${chunks.join('.')}${alpha ? '-alpha' : ''}`;
        }

        for (let i = chunks.length - 1; i > 0; i--) {
            const step = chunks[i];
            if (step === '9') {
                chunks[i] = '0';
            } else {
                chunks[i] = String(Number(step) + 1)
                return `${chunks.join('.')}${alpha ? '-alpha' : ''}`;
            }
        }
    }
    return new Promise((resolve, reject) => {
        fs.readJson('./npm_package/package.json', (err, packageObj) => {
            if (err) error(err);
            const newVersion = `${updateVersion(packageObj.version)}`;
            if (packageObj.version === newVersion) {
                resolve(true);
                return;
            };
            packageObj.version = newVersion;
            fs.writeJson('./npm_package/package.json', packageObj, err => {
                if (err) {
                    error(`Update version error ${err}`);
                    reject(false);
                    return;
                }
                success(`Update version success! New version - ${packageObj.version}`);
                resolve(true);
                return;
            })
        });
    })
}


exports.exe = (args) => {
    commandManager(args);
};