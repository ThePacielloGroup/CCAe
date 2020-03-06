module.exports = (browsers, mainController) => ({
    main: require('./main')(browsers, mainController),
    about: require('./about')(browsers, mainController),
    deficiency: require('./deficiency')(browsers, mainController),
    preferences: require('./preferences')(browsers, mainController),
})