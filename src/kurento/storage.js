class Viewer {
	constructor(){
		this.endpoint = null;
	}

	setEndpoint(endpoint){
		this.endpoint = endpoint;
		return this;
	}

	getEndpoint(){
		return this.endpoint;
	}
}

class Streamer {
	constructor(){
		this.endpoint = null;
		this.viewers = {};
		this.candidates = [];
	}

	addCandidate(candidate){
		console.log('addCandidate', candidate)
		if (this.endpoint){
			this.endpoint.addIceCandidate(candidate);
		} else {
			this.candidates.push(candidate);
		}
		return this;
	}

	processCandidates(){
		console.log('processCandidates', this.candidates)
		if (!this.endpoint){
			throw new Error('Add webrtc endpoint first');
		}

		while (this.candidates.length){
			this.endpoint.addIceCandidate(this.candidates.shift());
		}
	}

	setEndpoint(endpoint){
		this.endpoint = endpoint;
		return this;
	}

	getEndpoint(){
		return this.endpoint;
	}

	getViewer(viewerID){
		if (!this.viewers[viewerID]){
			this.viewers[viewerID] = new Viewer();
		}
		return this.viewers[viewerID];
	}
}

class Broadcast {
	constructor(){
		this.pipeline = null;
		this.streamers = {};
	}

	setPipline(pipeline){
		this.pipeline = pipeline;
		return this;
	}

	getPipline(){
		return this.pipeline;
	}

	getStreamer(streamerID){
		if (!this.streamers[streamerID]){
			this.streamers[streamerID] = new Streamer()
		}
		return this.streamers[streamerID];
	}
}

class Storage {
	constructor(){
		this.broadcasts = {};
	}

	getBroadcast(broadcastId){
		if (!this.broadcasts[broadcastId]){
			this.broadcasts[broadcastId] = new Broadcast();
		}

		return this.broadcasts[broadcastId];
	}
}


export default Storage