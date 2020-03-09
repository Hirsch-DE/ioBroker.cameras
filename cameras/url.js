const request = require('request');

function init(adapter, cam) {
    // do nothing
    return Promise.resolve();
}

function unload(adapter, cam) {
    // do nothing
    return Promise.resolve();
}

function process(adapter, cam, req, res) {
    return new Promise((resolve, reject) => {
        request(cam.url, {
            encoding: null,
            timeout: parseInt(cam.timeout || adapter.config.defaultTimeout, 10) || 2000,
        }, (error, status, body) => {
            if (error || !body || status.statusCode >= 400) {
                reject(error || body || status.statusCode);
            } else {
                resolve({body, contentType: status.headers['Content-type'] || status.headers['content-type']});
            }
        });
    });
}

module.exports = {
    init,
    process,
    unload,
};