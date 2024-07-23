async function getEnvironmentKey(base, env, auth){
    let url =  `${base}/environments`;
    
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: auth
        }
    })

    if(response.ok && response.status == 200){
        let list = await response.json();
        return (list.filter((detail) => detail.Name == env)[0]).Key
    }
}

async function getAppKey(base, pluginSpaceName, auth){
    let url =  `${base}/applications?IncludeEnvStatus=true`;
    
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: auth
        }
    })
    
    if(response.ok && response.status == 200){
        let list = await response.json();
        
        let app = list.filter((a) => a.Name == pluginSpaceName)[0];
        return app.Key
    }
}

async function getLatestAppVersion(base, appKey, auth) {
    let url =  `${base}/applications/${appKey}/versions`;
    
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: auth
        }
    })

    if(response.ok && response.status == 200){
        let list = await response.json();
        
        if(list.length > 0)
            return list[0].Version;
        return '1.0.0';
    }
    let res = await response.text();
    console.error(res)
    throw Error ("Couldn't retrive app tag version.")
}

module.exports = {
    getAppKey,
    getEnvironmentKey,
    getLatestAppVersion
}