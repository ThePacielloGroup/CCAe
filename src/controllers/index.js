module.exports = (browsers, preferences) => ({
    main: require('./main')(browsers, preferences),
    about: require('./about')(browsers, preferences),
    deficiency: require('./deficiency')(browsers, preferences),
    preferences: require('./preferences')(browsers, preferences),
})