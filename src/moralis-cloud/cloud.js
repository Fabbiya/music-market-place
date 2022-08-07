//moralis-admin-cli watch-cloud-folder --moralisApiKey OC3SxziJg8TUcSm --moralisApiSecret nnNNphwKBruUxuD --moralisSubdomain vskk5bt5imho.usemoralis.com --autoSave 1 --moralisCloudfolder /path/to/cloud/folder
Moralis.Cloud.define("fetchJson",async (request) => {
    return Moralis.Cloud.httpRequest({
        method:"GET",
        url:request.params.theUrl
    })
})