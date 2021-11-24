module.exports = (dirname, preferences) => ({
    main: require('./main')(dirname, preferences),
    about: require('./about')(dirname),
    deficiency: require('./deficiency')(dirname),
    preferences: require('./preferences')(dirname),
})