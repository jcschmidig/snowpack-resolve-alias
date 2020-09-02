"use strict"
// Snowpack Plugin to resolve the alias correctly
// Works above version 2.9
//
const { plugin, createAliases, createWarning } = require('plugin-resolve-alias')
//
module.exports = function (snowpackConfig, pluginOptions) {
    const devPath = pluginOptions.devPath || DEFAULT_PATH
    const Aliases = createAliases({
        config: snowpackConfig.alias,
        devPath
    })
    const Warning = createWarning({
        state: pluginOptions.noWarning || false,
        text: "[snowpack-resolve-alias] used for alias %s"
    })
    //
    return {
        name: 'snowpack-resolve-alias',
        async transform({ id:srcFilename, contents:srcContent }) {
            return plugin({
                srcFilename,
                srcContent,
                devPath,
                Aliases,
                Warning
            })
        }
    }
}

const DEFAULT_PATH = "src"
