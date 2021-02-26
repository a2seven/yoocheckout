const success = (msg) => {
    console.log("\x1b[32m%s", msg, "\x1b[0m");
}

const warning = (msg) => {
    console.log("\x1b[33m%s", msg, "\x1b[0m");
}

const error = (msg) => {
    console.log("\x1b[31m%s", msg, "\x1b[0m");
}

const info = (msg) => {
    console.log("\x1b[34m%s", msg, "\x1b[0m");
}

module.exports = {
    success,
    warning,
    error,
    info
}