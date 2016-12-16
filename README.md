# stan-vscode README

This package adds syntax highlighting for [Stan](https://mc-stan.org) files in [Visual Studio Code](https://code.visualstudio.com/).

![Syntax highilighting example](./img/highlight-example.png)

The grammar is converted from the [atom-language-stan](https://github.com/jrnold/atom-language-stan) Stan package.

## Installation

```
code --install-extension ivan-bocharov.stan-vscode
```

or find and install it from the Extensions view.

## Features

- Syntax highlighting

## Known issues

- The package highlights variable names that match block name (`model`, `data`, etc.).