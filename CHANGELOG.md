# Changelog

**Known issues**
- [Windows: Application menus aren't keyboard accessible](https://github.com/ThePacielloGroup/CCAe/issues/49)
- [Windows: Changing slider values is not announced in NVDA](https://github.com/ThePacielloGroup/CCAe/issues/37)
- [Windows/macOS: issue with colour picker when working with multiple displays at different density](https://github.com/ThePacielloGroup/CCAe/issues/54)
- [Windows: Downloaded installer from GitHub triggers Windows Defender SmartScreen](https://github.com/ThePacielloGroup/CCAe/issues/66)

## [v1.2.1](https://github.com/ThePacielloGroup/CCAe/tree/v1.2.1) (2019-11-06)

[Full Changelog](https://github.com/ThePacielloGroup/CCAe/compare/v1.1.2...v1.2.1)

**Implemented enhancements:**

- Make auto-update process optional [\#120](https://github.com/ThePacielloGroup/CCAe/issues/120)
- Added French, German, Japanese localization/translation [\#79](https://github.com/ThePacielloGroup/CCAe/issues/79)[\#137](https://github.com/ThePacielloGroup/CCAe/issues/137)
- HSV color support [\#103](https://github.com/ThePacielloGroup/CCAe/issues/103)

**Merged pull requests:**

- fix: Missing quit menu label. [\#138](https://github.com/ThePacielloGroup/CCAe/pull/138)
- fix: Label elements for attr. [\#131](https://github.com/ThePacielloGroup/CCAe/pull/131)
- fix: 'Uncaught TypeError' [\#130](https://github.com/ThePacielloGroup/CCAe/pull/130)
- Enhancement of i18n \#79 [\#129](https://github.com/ThePacielloGroup/CCAe/pull/129)
- Prevent accidental publish to npm [\#127](https://github.com/ThePacielloGroup/CCAe/pull/127)

## [v1.1.2](https://github.com/ThePacielloGroup/CCAe/tree/v1.1.2) (2019-06-07)
[Full Changelog](https://github.com/ThePacielloGroup/CCAe/compare/v1.1.1...v1.1.2)

**Implemented enhancements:**

- Zoom feature \(Closes \#38, \#108\) [\#112](https://github.com/ThePacielloGroup/CCAe/pull/112)
- Support for rgba\(...\) and hsla\(...\) [\#105](https://github.com/ThePacielloGroup/CCAe/issues/105)
- Minor UI changes [\#113](https://github.com/ThePacielloGroup/CCAe/issues/113)

**Fixed bugs:**

- Error when using the color switch feature [\#107](https://github.com/ThePacielloGroup/CCAe/issues/107)
- "Copy results" always converts colors to flat HEX [\#119](https://github.com/ThePacielloGroup/CCAe/issues/119)
- Auto-update error [\#100](https://github.com/ThePacielloGroup/CCAe/issues/100)

## [v1.1.1](https://github.com/ThePacielloGroup/CCAe/tree/v1.1.1) (06/04/2019)

[Full Changelog](https://github.com/ThePacielloGroup/CCAe/compare/v1.1.0...v1.1.1)

**Fixed bugs:**

- Color issue in Color blindness simulator
- Javascript error on launch of CCA from MSI install [\#99](https://github.com/ThePacielloGroup/CCAe/issues/99)
- Setup.exe version doesn't show up correctly in Windows' Add/Remove Programs list [\#97](https://github.com/ThePacielloGroup/CCAe/issues/97)
- CCA Window not high enough / content gets cut off [\#96](https://github.com/ThePacielloGroup/CCAe/issues/96)

## v1.1.0 (06/04/2019)
**New features:**
- [Added options for 2 digits rounding (#78)](https://github.com/ThePacielloGroup/CCAe/commit/434368fcc4d9e6f4034f957aa517fa4e89b34384)
- [Added HSL sliders (#56)](https://github.com/ThePacielloGroup/CCAe/commit/eadfcbb95c5c504d59abd45d792d781bea480b02)
- [Switch between HEX/RGB/HSL format for text input (#63)](https://github.com/ThePacielloGroup/CCAe/commit/a4e92231fd8646fc0445db372682a9a8314ddad5)

**Enhancements**
- [Build MSI format and custom install path (#95)](https://github.com/ThePacielloGroup/CCAe/commit/34d8000586aa4ae31b2f406bb9ad84bf93da19c4)
- [Added picker access from main menu](https://github.com/ThePacielloGroup/CCAe/commit/a65001dcca8221352e77fe2d00d131ac6c4840c9)
- [Menu option for Always on Top (#43)](https://github.com/ThePacielloGroup/CCAe/commit/8613f5887da34eb9bc9962cb4610acc5b6efb7c5)
- [Move picker by arrow keys (#92)](https://github.com/ThePacielloGroup/CCAe/commit/a60833f1a95d87180b022de480cde0aa7e40c130)
- [Preference dialog](https://github.com/ThePacielloGroup/CCAe/commit/53116f3eb9366dc9fa780194442a591b0a2d82e1)
- [Saving windows position on save](https://github.com/ThePacielloGroup/CCAe/commit/dd74afa88b918bc45ef7dd75b81cea2c55cb22a6)

**Fixed bugs**
- [Add cut/copy/paste to Edit menu on macOS (#90)](https://github.com/ThePacielloGroup/CCAe/commit/edd70683ed57cf328f61420682f73f6767447c73)
- [Various fixes](https://github.com/ThePacielloGroup/CCAe/commit/803560ee2cf5d25fbbf354ec2ff0e14fdf327857)

## v1.0.0 (08/10/2018)
**Enhancements**
- [Add keyboard shortcuts for all menu items](https://github.com/ThePacielloGroup/CCAe/commit/75a5b4955b7061888bc01b46b8ecca3b018ce50c)
- [Refactor color number input code](https://github.com/ThePacielloGroup/CCAe/commit/c817604eca8068d125e25b175a6c59b185bc195f)
- [Clamp sync'd sliders](https://github.com/ThePacielloGroup/CCAe/commit/835e2d6a0ef143ffd614d84a5184db9926afacfc)

**Fixed bugs**
- [Remove visual artifact on picker in macOS](https://github.com/ThePacielloGroup/CCAe/commit/6383c1a0f963c4f690dba0fb5ad889451af42416)

## v1.0.0-beta2 (05/10/2018)
**New features:**
- [Auto update](https://github.com/ThePacielloGroup/CCAe/commit/57f8d6a422cdafe33370182d9317c12b61804102)
**Enhancements**
- [Close app when main window is closed (Closes #64)](https://github.com/ThePacielloGroup/CCAe/commit/eb61988f462db9f8c6770ce3933046e4226b31bf)
- [Widen freeform foreground/background entry fields](https://github.com/ThePacielloGroup/CCAe/commit/30b26f197afaaad24e5a3d6535baa4df965d5545)
- [Updated README + CONTRIBUTING](https://github.com/ThePacielloGroup/CCAe/commit/d28eb30f90baf9b7e4623b398565f1d8a1c37564)
- [Make all text/number inputs auto-select they content](https://github.com/ThePacielloGroup/CCAe/commit/34bbd5f7e194f9a4bad62da3488042644ab3bc6b)

**Fixed bugs**
- [Fix colour format check regexps](https://github.com/ThePacielloGroup/CCAe/commit/158b7f32220091e0dbfd4d19dbaba626aff8ea6a)
- [Prevent uncaught exception for specific incorrect foreground/background colour entry](https://github.com/ThePacielloGroup/CCAe/commit/1b225aeaba0136cf79da36e8a3c6091b9838960e)
- [Update README.md](https://github.com/ThePacielloGroup/CCAe/commit/f8ee06562a8b87b4f6852cb9552cf687ba920e7a)
- [Add step to alpha number input as well](https://github.com/ThePacielloGroup/CCAe/commit/838d0e0dda4eaf724577fb50c1a6a693147119c0)
- [Only force-update value of alpha number input if not focused](https://github.com/ThePacielloGroup/CCAe/commit/293f3a1934a45319e49244f3017cf5d51dfddbdf)
- [Increase granularity of alpha slider, set correct min/max on number input](https://github.com/ThePacielloGroup/CCAe/commit/544f3dd74376e598a2e86820033678797b6757c9)

## v1.0.0-beta1 (26/09/2018)

**Enhancements**
- [Version update and MacOS code signing (See #33)](https://github.com/ThePacielloGroup/CCAe/commit/ca0408675ea3134088d38abc47f25560abe0fc6f)
- [Change WCAG 2.1 section](https://github.com/ThePacielloGroup/CCAe/commit/a64266049e168cdaa0024b238e7d268c7dedbb2a)
- [Focus text input contents on focus](https://github.com/ThePacielloGroup/CCAe/commit/5ed33fb9925d17d583995dbe66e35fef8a763dba)
- [Added AT announcement when user enter invalid color format (Closes #39)](https://github.com/ThePacielloGroup/CCAe/commit/0b12a3463c82b5166a3ff8202893232f02b8bdaa)
- [Make contrast ratio section an atomic live region](https://github.com/ThePacielloGroup/CCAe/commit/8b3e3ebb11bf8d87526615afca8a807f5ffd4aec)
**Fixed bugs**
- [Fixed preview background (Closes #48)](https://github.com/ThePacielloGroup/CCAe/commit/8dcd558a1c9b02af6661b96f167b4eb5e3b548b0)
- [Fix displayValidate to actually change foreground following input](https://github.com/ThePacielloGroup/CCAe/commit/ae38b872257909fb3519cb4811ddf3126881bf58)
- [Explicitly set a styled focus indication outline](https://github.com/ThePacielloGroup/CCAe/commit/ea0a06bb730dc867b3300036434728bc4e0dccb6)
- [Expose the example SVG icon as an image with relevant alternative text](https://github.com/ThePacielloGroup/CCAe/commit/0f75d9fbd69bd01d0effc12d1998221024f4e1d5)
- [Give foreground/background free value entry fields more sensible aria-label](https://github.com/ThePacielloGroup/CCAe/commit/1dfea9435b0c982104f0f1390cc295b0f8f560ed)
