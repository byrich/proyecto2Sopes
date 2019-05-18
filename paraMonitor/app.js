var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//socket.io
var fs = require('fs');
var server = require('http').Server(app);
var io=require('socket.io').listen(server);
server.listen(2323);

var ram_usada = 0;
var ram_total = 1;
var cpu;

var _user = 1;
var _nice = 1;
var _system = 1;
var _idle = 1;
var _iowait = 1;
var _irq = 1;
var _softirq = 1;
var _steal = 1;

(function schedule() {
	setTimeout( function () {

    if(fs.existsSync('/proc/modulo_memoria'))
    {
      var mem_ram = require('fs').readFileSync('/proc/modulo_memoria', 'utf-8')
          .split(',');
      var _ram_usada = mem_ram[0].split(':');
      ram_usada = _ram_usada[1].trim();
      var _ram_total = mem_ram[2].split(':');
      ram_total = _ram_total[1].trim().replace('}','').replace('\n','').replace('"','');
    }
    /*
    if(fs.existsSync('/proc/stat'))
    {
      var stats = require('fs').readFileSync('/proc/stat', 'utf-8')
          .split('\n');
      var cpu = stats[0].split(' ');
      _user = cpu[2];
      _nice = cpu[3];
      _system = cpu[4];
      _idle = cpu[5];
      _iowait = cpu[6];
      _irq = cpu[7];
      _softirq = cpu[8];
      _steal = cpu[9];
    }
    */
    if(fs.existsSync('/proc/modulo_cpu'))
    {
      //{"user":808,"nice":0,"system":859,"idle":54358,"iowait":313,"irq":0,"softirq":28,"steal":272}
      var cpu = require('fs').readFileSync('/proc/modulo_cpu', 'utf-8')
          .replace('}','').replace('\n','').split(',');
      //var cpu = stats[0].split(',');
      _user = cpu[0].split(':');
      _nice = cpu[1].split(':');
      _system = cpu[2].split(':');
      _idle = cpu[3].split(':');
      _iowait = cpu[4].split(':');
      _irq = cpu[5].split(':');
      _softirq = cpu[6].split(':');
      _steal = cpu[7].split(':');
    }
    
		schedule();
	}, 1000);
})();

io.sockets.on('connection', function(socket) {

  setInterval(function(){
      socket.emit('memoria1', {usada: ram_usada, total: ram_total}); 
  }, 1000);

  setInterval(function(){
      socket.emit('cpu1', {user: _user[1], nice: _nice[1], system: _system[1], 
        idle: _idle[1], iowait: _iowait[1], irq: _irq[1], softirq: _softirq[1], steal: _steal[1]}); 
  }, 1000);
});

module.exports = app;
