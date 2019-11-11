function isAuthorized(e) {
    return 'key' in e.parameters && e.parameters.key[0] === config.API_KEY;
}