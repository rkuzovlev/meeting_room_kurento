import koa from 'koa'
import bodyParser from 'koa-bodyparser'
import morgan from 'koa-morgan'

import config from 'config'

import routes from './routes'
import * as kurento from './kurento'

var app = koa();

app.keys = config.get("keys")

if (process.env.NODE_ENV != 'production'){
	app.use(morgan.middleware('dev'))
}

app.use(bodyParser());
app.use(routes.routes());

const serverConf = config.get("server");
const host = process.env.HOST || serverConf.host;
const port = process.env.PORT || serverConf.port;


kurento.initKurento().then(function(){
	app.listen(port, host, function() {
		console.log('kurento meeting room is started on', host + ":" + port);
	});
}).catch(function(err){
	console.error("Can't start server", err)
});


// kurento.initKurento().then(function(){
// 	let k = kurento.getKurento();
// 	console.log(k);
// }).catch(function(err){
// 	console.error("kurento error", err)
// })