const utils = require('./utils');
const fs = require("fs");
const { finished } = require('stream/promises');
const { Readable } = require('stream');
const path = require("path");


const DOWNLOAD_FOLDER = "downloads";

async function download(url, fileName) {

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: auth
        }
    })

    if(!response.ok || response.status != 200) {
      let error = await response.text();
      console.error(error);
      throw Error("Couldn't download file :(((.")
    }
    let file =  response.body;

    if (!fs.existsSync(DOWNLOAD_FOLDER)){
		console.log("Create downloads folder: " + DOWNLOAD_FOLDER);
		fs.mkdirSync(DOWNLOAD_FOLDER);
	}
    
    const destination = path.resolve(`./${DOWNLOAD_FOLDER}/${fileName}`);
    const fileStream = fs.createWriteStream(destination, { flags: 'wx' });
    await finished(Readable.fromWeb(file).pipe(fileStream));
    console.log(`Finifhed writing to ${destination}`);
}


async function downloadOAP(baseURL, pluginName, inEnv, version, auth) {
    let envKey = await utils.getEnvironmentKey(baseURL, inEnv, auth);
    let pluginKey = await utils.getAppKey(baseURL, pluginName, auth);

    let downloadEndpoint = `${baseURL}/environments/${envKey}/applications/${pluginKey}/content`
    const response = await fetch(downloadEndpoint, {
        method: 'GET',
        headers: {
            Authorization: auth
        }
    })
    console.log(version)
    if(response.ok && response.status == 200){
        let downloadInfo = await response.json()
        await download(downloadInfo.url, `v${version}.oap`)
    }
}

let pluginSpaceName = process.env.npm_config_plugin;
let baseURL = process.env.npm_config_lifetime;
let auth = process.env.npm_config_authentication;
let environment = process.env.npm_config_environment;
let forgeVersion = process.env.npm_config_forge;
console.log(forgeVersion)
baseURL = `https://${baseURL}/lifetimeapi/rest/v2`;

downloadOAP(baseURL, pluginSpaceName, environment, forgeVersion, auth)