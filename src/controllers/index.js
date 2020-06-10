module.exports = (browsers, sharedObject) => ({
    main: require('./main')(browsers, sharedObject),
    about: require('./about')(browsers, sharedObject),
    deficiency: require('./deficiency')(browsers, sharedObject),
    preferences: require('./preferences')(browsers, sharedObject),
})