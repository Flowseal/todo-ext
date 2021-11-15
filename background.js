function set(options, callback){
    chrome.storage.sync.set(options, callback);
}
function get(options, callback){
    chrome.storage.sync.get(options, callback);
}