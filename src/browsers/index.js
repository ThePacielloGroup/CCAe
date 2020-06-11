module.exports = (dirname, sharedObject) => ({
    main: require('./main')(dirname, sharedObject),
    about: require('./about')(dirname, sharedObject),
    deficiency: require('./deficiency')(dirname, sharedObject),
    preferences: require('./preferences')(dirname, sharedObject),
})