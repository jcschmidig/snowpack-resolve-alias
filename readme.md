# Snowpack Plugin to resolve the configured option of "alias"

#### 1. New feature

Snowpack introduced a new feature which allowed to configure one or more "alias" to simplify importing components.

So, instead of

`import { userIsLoggedIn } from '../store/user'`

you may use

`import { userIsLoggedIn } from '@user'`

by configuring in `snowpack.config.json`
```
"alias": {
        "@user": "./src/store/user"
}
```
see also [Import Aliases](https://www.snowpack.dev/reference/configuration#alias)

#### 2. Why this plugin ?

As of the current version 2.9.x of Snowpack, this feature is not fully supported in build and dev mode, but may be in future versions.

This plugin uses the same configuration "alias" in snowpack.config.json to make sure that all aliases are successfully resolved.

#### 3. Usage

- install `npm i -D snowpack-resolve-alias`
- add in snowpack.config.json

```
"plugins": [
    [...*],
    ["snowpack-resolve-alias", {
        "extension": [ ".js" ],
        "devPath": "src",
        "noWarning": true
    }],
    [...**]
]
```

- option: `extensions`, an array of file extensions to check for
- option: `devPath`, denotes the directory with the source code, usually `src` which is also the default.
- option: `noWarning`, disables the warning `[snwopack-resolve-alias] used for alias xxx` during compilation, default is false.

- always put this plugin after a framework plugin like *svelte** and before a bundler plugin like *webpack***
