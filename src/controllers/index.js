module.exports = (browsers, sharedObjects) => ({
    main: require('./main')(browsers, sharedObjects),
    picker: require('./picker')(browsers, sharedObjects),
})