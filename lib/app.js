module.exports = () =>
  require('express')()
    .use(require('express').static('./public'))
    .use('/ui', require('./routers/ui')())
    .use('/', require('./routers/api')());
