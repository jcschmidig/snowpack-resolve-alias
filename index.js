// Snowpack Plugin to resolve the alias correctly
// Works above version 2.9
//
module.exports = function (snowpackConfig, pluginOptions) {
    const devPath = setSlash(pluginOptions.devPath || DEFAULT_PATH)
    const aliases = getAlias(snowpackConfig.alias, devPath)
    //
    return {
        name: 'snowpack-resolve-alias',
        async transform({ id:srcFilename, contents:srcContent }) {
            // check input
            if ( !(typeof srcFilename === 'string' &&
                   srcFilename.has(devPath) && srcFilename.endsWith('.js') &&
                   typeof srcContent === 'string') ) return
            //
            const content = new Content(srcContent)
            // create relative path fragment
            const relPath = PARENT_DIR.repeat(distance(srcFilename, devPath))
                            ||
                            CURRENT_DIR
            // replace aliases
            for (const [aliasName, aliasPath] of aliases)
                content.replace(aliasName, relPath + aliasPath)
            //
            return content.source
        }
    }
}
//
//
String.prototype.has = function(val)
    // ~-1 => 0 => false
    { return ~this.indexOf(val) }
String.prototype.tail = function(sep)
    // rejoin the part behind the separator
    { return this.split(sep).slice(1).join(sep) }
//
const
    SLASH = "/"
    CURRENT_DIR = "./",
    PARENT_DIR = "../",
    DEFAULT_PATH = "src"
//
function unsetSlash(value) {
    if (!(value && value.substring)) return ""
    //
    return value.substring(
        // start: ~~false => 0, ~~true => 1
        ~~value.startsWith(SLASH),
        // length - [ 0 | 1 ]
        value.length - ~~value.endsWith(SLASH)
    )
}
function setSlash(value) {
    return SLASH + unsetSlash(value) + SLASH
}
//
function getAlias(config={}, path="") {
    const alias = new Map()
    for (const key in config) {
        alias.set(
            unsetSlash(key),
            // extract destination path
            unsetSlash(config[key].tail(path))
        )
    }
    return alias
}
//
function distance(filePath, sep) {
    // How many slashes behind the separator do we count?
    return --filePath.tail(sep)
                     .split(SLASH)
                     .length
}
//
function Content(source) {
    this.source = source
    this.replace = function(key, val) {
        if (this.source.has(key))
            this.source = this.source.replace(new RegExp(key, 'g'), val)
    }
}
