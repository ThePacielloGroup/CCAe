module.exports = (dirname) => ({
    main: require('./main')(dirname),
    picker: require('./picker')(dirname),
})