const liveServer = require("live-server");

const params = {
    port: 8181,
    host: "localhost",
    open: true,
    file: "./dis/index.html",
    wait: 1000,
    logLevel: 2,
};
liveServer.start(params);