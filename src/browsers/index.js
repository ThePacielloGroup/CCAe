module.exports = (dirname, store) => ({
    main: require('./main')(dirname, store),
    about: require('./about')(dirname),
    deficiency: require('./deficiency')(dirname),
    preferences: require('./preferences')(dirname),
})