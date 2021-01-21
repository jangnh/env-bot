function should_exists_debug_env(txt = "") {
    const regex = /\+\s*APP_DEBUG=true/gm;
    const search = txt.search(regex)
    if (search > 0) {
        return true
    }
    return false
}

module.exports = {
    should_exists_debug_env
}