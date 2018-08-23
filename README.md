# Colour Contrast Analyser
![GitHub (pre-)release](https://img.shields.io/github/release/thepaciellogroup/ccae/all.svg)
![GPL-3.0 licence](https://img.shields.io/github/license/thepaciellogroup/ccae.svg)

The Colour Contrast Analyser (CCA) helps you determine the legibility of text and the contrast of visual elements, such as graphical controls and visual indicators.

This repository contains the source code for the new Colour Contrast Analyser (CCA) builds for Windows and MacOS based on [Electron](https://electronjs.org/). For the previous, non-Electron versions ("CCA Classic"), see the [CCA-Win](https://github.com/ThePacielloGroup/CCA-Win) and [CCA-OSX](https://github.com/ThePacielloGroup/CCA-OSX) repositories.

For further information, see [The Paciello Group's Colour Contrast Analyser resource page](https://developer.paciellogroup.com/resources/contrastanalyser/).

> This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

## Developers

### How to build
- Install dependencies:
```shell
  npm install
```

- Run it:
```shell
  npm run start
```

- To build a new version:
```shell
  # Because some libraries need to be compiled natively, you can build only for your current OS.
  # i.e. you can't build a Windows version if you are under MacOS

  # build a MacOS version
  npm run dist

  # build a Windows version
  npm run dist-windows
```