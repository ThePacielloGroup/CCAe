module.exports = (dirname) => ({
    main: require('./main')(dirname),
    about: require('./about')(dirname),
    deficiency: require('./deficiency')(dirname),
    preferences: require('./preferences')(dirname),
})