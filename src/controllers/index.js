module.exports = (browsers, mainController) => ({
    main: require('./main')(browsers, mainController),
    picker: require('./picker')(browsers, mainController),
})