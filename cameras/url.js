const request = require('request');

function init(adapter, cam) {

    adapter.__urlCameras = adapter.__urlCameras || {};
    adapter.__urlCameras[cam.name] = true;

    // check parameters
    if (!cam.url || typeof cam.url !== 'string' || (!cam.url.startsWith('http://') && !cam.url.startsWith('https://'))) {
        return Promise.reject('Invalid URL: "' + cam.url + '"');
    }

    return Promise.resolve();
}

function unload(adapter, cam) {
    if (adapter.__urlCameras[cam.name]) {
        delete adapter.__urlCameras[cam.name];
    }
    // after last unload all the resources must be cleared too
    if (Object.keys(adapter.__urlCameras)) {
        // unload
    }

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
        })
            .on('error', error => reject(error));
    });
}

module.exports = {
    init,
    process,
    unload,
};