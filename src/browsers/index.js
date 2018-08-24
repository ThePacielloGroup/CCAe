module.exports = (dirname) => ({
    main: require('./main')(dirname),
    picker: require('./picker')(dirname),
    about: require('./about')(dirname),
    deficiency: require('./deficiency')(dirname),
})