# Changelog

## Known issues
- Windows: Application menus aren't keyboard accessible (see https://github.com/ThePacielloGroup/CCAe/issues/49)
- Windows/macOS: Zoom feature does't resize the application window (see https://github.com/ThePacielloGroup/CCAe/issues/38)
- Windows: Changing slider values is not announced in NVDA (see https://github.com/ThePacielloGroup/CCAe/issues/37)
- Windows/macOS: issue with colour picker when working with multiple displays at different density (see https://github.com/ThePacielloGroup/CCAe/issues/54)

## v1.0.0-beta2 (05/10/2018)
### New Features
- [Auto update](https://github.com/ThePacielloGroup/CCAe/commit/57f8d6a422cdafe33370182d9317c12b61804102)
### Enhancements
- [Close app when main window is closed (Closes #64)](https://github.com/ThePacielloGroup/CCAe/commit/eb61988f462db9f8c6770ce3933046e4226b31bf)
- [Widen freeform foreground/background entry fields](https://github.com/ThePacielloGroup/CCAe/commit/30b26f197afaaad24e5a3d6535baa4df965d5545)
- [Updated README + CONTRIBUTING](https://github.com/ThePacielloGroup/CCAe/commit/d28eb30f90baf9b7e4623b398565f1d8a1c37564)
- [Make all text/number inputs auto-select they content](https://github.com/ThePacielloGroup/CCAe/commit/34bbd5f7e194f9a4bad62da3488042644ab3bc6b)

### Bugs Fixes
- [Fix colour format check regexps](https://github.com/ThePacielloGroup/CCAe/commit/158b7f32220091e0dbfd4d19dbaba626aff8ea6a)
- [Prevent uncaught exception for specific incorrect foreground/background colour entry](https://github.com/ThePacielloGroup/CCAe/commit/1b225aeaba0136cf79da36e8a3c6091b9838960e)
- [Update README.md](https://github.com/ThePacielloGroup/CCAe/commit/f8ee06562a8b87b4f6852cb9552cf687ba920e7a) - @Patrick H. Lauke
- [Add step to alpha number input as well](https://github.com/ThePacielloGroup/CCAe/commit/838d0e0dda4eaf724577fb50c1a6a693147119c0)
- [Only force-update value of alpha number input if not focused](https://github.com/ThePacielloGroup/CCAe/commit/293f3a1934a45319e49244f3017cf5d51dfddbdf)
- [Increase granularity of alpha slider, set correct min/max on number input](https://github.com/ThePacielloGroup/CCAe/commit/544f3dd74376e598a2e86820033678797b6757c9)

## v1.0.0-beta1 (26/09/2018)

### Enhancements
- [Version update and MacOS code signing (See #33)](https://github.com/ThePacielloGroup/CCAe/commit/ca0408675ea3134088d38abc47f25560abe0fc6f)
- [Change WCAG 2.1 section](https://github.com/ThePacielloGroup/CCAe/commit/a64266049e168cdaa0024b238e7d268c7dedbb2a)
- [Focus text input contents on focus](https://github.com/ThePacielloGroup/CCAe/commit/5ed33fb9925d17d583995dbe66e35fef8a763dba)
- [Added AT announcement when user enter invalid color format (Closes #39)](https://github.com/ThePacielloGroup/CCAe/commit/0b12a3463c82b5166a3ff8202893232f02b8bdaa)
- [Make contrast ratio section an atomic live region](https://github.com/ThePacielloGroup/CCAe/commit/8b3e3ebb11bf8d87526615afca8a807f5ffd4aec)
### Bugs Fixes
- [Fixed preview background (Closes #48)](https://github.com/ThePacielloGroup/CCAe/commit/8dcd558a1c9b02af6661b96f167b4eb5e3b548b0)
- [Fix displayValidate to actually change foreground following input](https://github.com/ThePacielloGroup/CCAe/commit/ae38b872257909fb3519cb4811ddf3126881bf58)
- [Explicitly set a styled focus indication outline](https://github.com/ThePacielloGroup/CCAe/commit/ea0a06bb730dc867b3300036434728bc4e0dccb6)
- [Expose the example SVG icon as an image with relevant alternative text](https://github.com/ThePacielloGroup/CCAe/commit/0f75d9fbd69bd01d0effc12d1998221024f4e1d5)
- [Give foreground/background free value entry fields more sensible aria-label](https://github.com/ThePacielloGroup/CCAe/commit/1dfea9435b0c982104f0f1390cc295b0f8f560ed)
