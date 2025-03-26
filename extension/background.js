const t = {
    PROVIDER: "PROVIDER",
    MODULE: "MODULE",
    PROVIDER_RESOURCE: "PROVIDER_RESOURCE",
    PROVIDER_DATA_SOURCE: "PROVIDER_DATA_SOURCE",
    BROWSE_PROVIDER: "BROWSE_PROVIDER",
    BROWSE_MODULE: "BROWSE_MODULE",
    SEARCH_PROVIDER: "SEARCH_PROVIDER",
    SEARCH_MODULE: "SEARCH_MODULE",
    UNDEFINED: "UNDEFINED"
}

function parseURL(type, url) {
    // Remove the https://registry.terraform.io/{providers|modules}/
    const path = url.split("/").slice(4);

    if(type === t.PROVIDER) {
        return {
            "namespace": path[0],
            "name": path[1],
            "version": path[2],
        };
    } else if (type === t.MODULE) {
        return {
            "namespace": path[0],
            "type": path[1],
            "provider": path[2],
            "version": path[3]
        };
    } else if (type === t.PROVIDER_RESOURCE || type === t.PROVIDER_DATA_SOURCE) {
        return {
            "namespace": path[0],
            "name": path[1],
            "version": path[2],
            "rds": path[5]
        };
    }

    return {};
}

function sendToOpenTofu(type, p) {
    let newURL;
    if (type === t.PROVIDER) {
        if (p.version === "latest") {
            newURL = `https://search.opentofu.org/provider/${p.namespace}/${p.name}/latest`
        } else {
            newURL = `https://search.opentofu.org/provider/${p.namespace}/${p.name}/v${p.version}`
        }
    } else if (type === t.MODULE) {
        if (p.version === "latest") {
            newURL = `https://search.opentofu.org/module/${p.namespace}/${p.type}/${p.provider}/latest`
        } else {
            newURL = `https://search.opentofu.org/module/${p.namespace}/${p.type}/${p.provider}/v${p.version}`
        }
    } else if (type === t.BROWSE_PROVIDER || type === t.SEARCH_PROVIDER) {
        newURL = "https://search.opentofu.org/providers"
    } else if (type === t.BROWSE_MODULE || type === t.SEARCH_MODULE) {
        newURL = "https://search.opentofu.org/modules"
    } else if (type === t.PROVIDER_RESOURCE) {
        if (p.version === "latest") {
            newURL = `https://search.opentofu.org/provider/${p.namespace}/${p.name}/latest/docs/resources/${p.rds}`
        } else {
            newURL = `https://search.opentofu.org/provider/${p.namespace}/${p.name}/v${p.version}/docs/resources/${p.rds}`
        }
    } else if (type === t.PROVIDER_DATA_SOURCE) {
        if (p.version === "latest") {
            newURL = `https://search.opentofu.org/provider/${p.namespace}/${p.name}/latest/docs/datasources/${p.rds}`
        } else {
            newURL = `https://search.opentofu.org/provider/${p.namespace}/${p.name}/v${p.version}/docs/datasources/${p.rds}`
        }
    } else {
        return;
    }
    window.location.href = newURL;
}

function parseRegistry(){
    const location = window.location.href
    const baseURL = "https://registry.terraform.io/"

    let type = t.UNDEFINED;
    const rds = location.match(/\/docs\/(?<rds>resources|data-sources)\/.*/);
    if(rds !== null && rds.hasOwnProperty("groups") && "rds" in rds.groups){
        const rType = rds.groups["rds"];
        if(rType === "resources"){
            type = t.PROVIDER_RESOURCE;
        } else {
            type = t.PROVIDER_DATA_SOURCE
        }
    } else {
        if(location.startsWith(`${baseURL}providers/`)){
            type = t.PROVIDER;
        } else if(location.startsWith(`${baseURL}modules/`)){
            type = t.MODULE;
        } else if(location.startsWith(`${baseURL}browse/providers`)){
            type = t.BROWSE_PROVIDER
        } else if(location.startsWith(`${baseURL}browse/modules`)){
            type = t.BROWSE_MODULE
        } else if(location.startsWith(`${baseURL}search/providers`)) {
            type = t.SEARCH_PROVIDER;
        } else if(location.startsWith(`${baseURL}search/modules`)) {
            type = t.SEARCH_MODULE;
        }
    }

    if(type === t.UNDEFINED){
        return;
    }

    const parsed = parseURL(type, location);
    sendToOpenTofu(type, parsed);
}

function parseDocs(){
    const location = window.location.href
    const newURL = location.replace("https://developer.hashicorp.com/terraform", "https://opentofu.org/docs");

    if(newURL !== location){
        window.location.href = newURL;
    } else {
        console.log("URL not supported");
    }
}

async function Main(){
    const location = window.location.href
    const registryBaseURL = "https://registry.terraform.io/"
    const docsBaseURL = "https://developer.hashicorp.com/"

    if(location.startsWith(registryBaseURL)){
        parseRegistry();
    } else if(location.startsWith(docsBaseURL)){
        parseDocs()
    }


}

Main().then();