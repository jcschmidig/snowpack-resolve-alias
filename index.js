// Snowpack Plugin to resolve the alias correctly
// Works above version 2.9
//
module.exports = function (snowpackConfig, pluginOptions) {
    const devPath = setSlash(pluginOptions.devPath || DEFAULT_PATH)
    const aliases = getAlias(snowpackConfig.alias, devPath)
    const warning = new Warning(pluginOptions.noWarning || false)
    //
    return {
        name: 'snowpack-resolve-alias',
        async transform({ id:srcFilename, contents:srcContent }) {
            // check input
            if ( !(typeof srcFilename === 'string' &&
                   srcFilename.has(devPath) && srcFilename.endsWith('.js') &&
                   typeof srcContent === 'string') ) return
            //
            const content = new Content(srcContent, warning)
            // create relative path fragment
            const relPath = PARENT_DIR.repeat(distance(srcFilename, devPath))
                            ||
                            CURRENT_DIR
            // replace aliases
            for (const [aliasName, aliasPath] of aliases)
                content.replace(aliasName, relPath + aliasPath)
            //
            return content.changedSource()
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
    if (typeof value !== 'string') return ""
    //
    return value.substring(
        // start: false => 0, true => 1
        +value.startsWith(SLASH),
        // length - [ 0 | 1 ]
        value.length - value.endsWith(SLASH)
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
function Content(source, warning) {
    this.changed = false
    this.source = source
    this.warning = warning
    this.changedSource = function() {
        if (this.changed) return this.source
    }
    this.replace = function(key, val) {
        // [import {xxx}] from '<key>' => from '<val>'
        const regex = `(\\s+from\\s+['|"])${escape(key)}(['|"|\\/])`
        const match = new RegExp(regex, 'g')
        // replace <key> with <val>
        const repl = `$1${val}$2`
        if (match.test(this.source)) {
            this.source = this.source.replace(match, repl)
            this.changed = true
            this.warning.add(key)
        }
    }
    //
    function escape(string) {
        return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')
    }
}
//
function Warning(state) {
    this.state = state
    this.warnings = new Set()
    this.add = function(key) {
        if (this.state) return
        //
        if (!this.warnings.has(key)) {
            this.warnings.add(key)
            console.log(`[snowpack-resolve-alias] used for alias ${key}`)
        }
    }
}
