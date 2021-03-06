const https = require('https');
const config = require('../config.json');
const hostname = 'www.lingq.com';
const port = 443;
let token, language, contentId;

if (process.argv[2] === undefined) {
    console.log("No content ID provided. Exiting.")
    process.exit();
} else {
    contentId = process.argv[2];
}

if (config.apiKey === "" || config.language === "") {
    console.log("No values found in config.json. Exiting.")
    process.exit();
} else {
    token = 'Token ' + config.apiKey;
    language = config.language;
}

let options = {
    hostname: hostname,
    port: port,
    headers: {'Authorization': token}
};

const getText = () => {
    options.path = '/api/languages/' + language + '/lessons/' + contentId + '/text/';
    return callApi(options);
};

const getVocabulary = () => {
    options.path = '/api/languages/' + language + '/lessons/' + contentId + '/lingqs/';
    return callApi(options);
};

const callApi = (options) => {
    return new Promise((resolve, reject) => {
        https.get(options, (response) => {
            let text = '';
            response.on('data', function (data) {
                text += data.toString();
            });
            response.on('end', function() {
                try {
                    t = JSON.parse(text);
                    if (t.detail === 'Invalid token.') reject('ERROR: Invalid API token. Exiting.');
                } catch (error) {
                    reject('ERROR: Failed to parse API response. Exiting.');
                }
                resolve(text);
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

exports.getText = getText;
exports.getVocabulary = getVocabulary;