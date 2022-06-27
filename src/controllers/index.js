module.exports = (browsers, store) => ({
    main: require('./main')(browsers, store),
    about: require('./about')(browsers, store),
    deficiency: require('./deficiency')(browsers, store),
    preferences: require('./preferences')(browsers, store),
})