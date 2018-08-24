module.exports = (browsers, mainController) => ({
    main: require('./main')(browsers, mainController),
    picker: require('./picker')(browsers, mainController),
    about: require('./about')(browsers, mainController),
    deficiency: require('./deficiency')(browsers, mainController),
})