import koaRouter from 'koa-router'
import * as kurento from "./kurento"

var router = koaRouter()

router.post('/broadcast/new/:broadcastid/:streamerid', function*(){
	this.assert(this.params.broadcastid, 400, 'broadcast id is not found');
	this.assert(this.params.streamerid, 400, 'streamer id is not found');
	this.assert(this.request.body, 400, "can't parse post body");
	this.assert(this.request.body.sdpOffer, 400, "can't find sdpOffer in post body");

	try {
		yield kurento.newBroadcaster(this.params.broadcastid, this.params.streamerid, this.request.body.sdpOffer);
	} catch (e) {
		this.throw(500, e.message)
	}

	this.status = 200;
});


router.post('/broadcast/candidate/:broadcastid/:streamerid', function*(){
	this.assert(this.params.broadcastid, 400, 'broadcast id is not found');
	this.assert(this.params.streamerid, 400, 'streamer id is not found');
	this.assert(this.request.body, 400, "can't parse post body");
	this.assert(this.request.body.candidate, 400, "can't find candidate in post body");

	try {
		yield kurento.newCandidate(this.params.broadcastid, this.params.streamerid, this.request.body.candidate);
	} catch (e) {
		this.throw(500, e.message)
	}

	this.status = 200;
});

export default router