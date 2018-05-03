module.exports = (browsers, eventEmitter) => ({
    main: require('./main')(browsers, eventEmitter),
    picker: require('./picker')(browsers, eventEmitter),
})