# stan-vscode README

This package adds syntax highlighting for [Stan](https://mc-stan.org) files in [Visual Studio Code](https://code.visualstudio.com/).

![Syntax highilighting example](./img/highlight-example.png)

The grammar is converted from the [sublime-stan](https://github.com/dougalsutherland/sublime-stan) Stan package.

## Installation

```
code --install-extension ivan-bocharov.stan-vscode
```

or find and install it from the Extensions view.

## Features

- Syntax highlighting
- Sets configuration accordingly to [Stan](https://mc-stan.org]) guidelines (no tabs, two spaces

## Known issues

- The package highlights variable names that match function or distribution name.