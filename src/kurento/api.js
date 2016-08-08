import * as kurento from './kurento';
import Storage from './storage';
import * as cent from './../centrifugo';

let storage = new Storage();

export let newCandidate = function(broadcastID, streamerID, candidate){
	return new Promise(function(resolve, reject){
		let bc = storage.getBroadcast(broadcastID);
		let streamer = bc.getStreamer(streamerID);

		streamer.addCandidate(candidate);

		resolve();
	});
}

export let createMediaPipeline = function(broadcastID){
	return new Promise(function(resolve, reject){
		let kurentoClient = null
		try {
			kurentoClient = kurento.getKurento();
		} catch (e) {
			return reject(e)
		}

		kurentoClient.create('MediaPipeline', function(error, pipeline) {
			if (error) {
				return reject(error)
			}

			let bc = storage.getBroadcast(broadcastID);
			bc.setPipline(pipeline);
			resolve();
		});
	});
}


export let createWebRtcEndpoint = function(broadcastID, streamerID, viewerID){
	return new Promise(function(resolve, reject){
		let bc = storage.getBroadcast(broadcastID);

		let pipeline = bc.getPipline();
		if (!pipeline){
			return reject(new Error('Pipline for broadcast' + broadcastID + ' is not found'));
		}
		pipeline.create('WebRtcEndpoint', function(error, webRtcEndpoint) {
			if (error) {
				return reject(error)
			}
			
			// console.log("WebRtcEndpoint", webRtcEndpoint);
			let streamer = bc.getStreamer(streamerID);
			if (viewerID){
				streamer.getViewer(viewerID).setEndpoint(webRtcEndpoint);
			} else {
				streamer.setEndpoint(webRtcEndpoint);
			}
			resolve();
		});
	});
}


export let configureStreamerWebRtcEndpoint = function(broadcastID, streamerID, sdpOffer){
	return new Promise(function(resolve, reject){
		let bc = storage.getBroadcast(broadcastID);
		let streamer = bc.getStreamer(streamerID);
		let webRtcEndpoint = streamer.getEndpoint();

		if (!webRtcEndpoint){
			return reject(new Error('WebRtcEndpoint for streamer ' + streamerID + ' on boradcast ' + broadcastID + ' is not found'));
		}
		
		streamer.processCandidates()

		resolve();

		webRtcEndpoint.on('OnIceCandidate', function(event) {
			console.log('OnIceCandidate', event);
			var candidate = kurento.register.complexTypes.IceCandidate(event.candidate);
			console.log('candidate', candidate);
			
			let data = {
				broadcast: broadcastID,
				type: 'iceCandidate',
				candidate: candidate
			};

			cent.sendToUser(streamerID, data);
		});

		webRtcEndpoint.processOffer(sdpOffer, function(error, sdpAnswer) {
			if (error) {
				let data = {
					broadcast: broadcastID,
					type: 'error',
					message: "" + error
				};

				cent.sendToUser(streamerID, data);
				return
			}

			let data = {
				broadcast: broadcastID,
				type: 'sdpAnswer',
				sdpAnswer: sdpAnswer
			};

			cent.sendToUser(streamerID, data);
		});

		webRtcEndpoint.gatherCandidates(function(error) {
			if (error) {
				let data = {
					broadcast: broadcastID,
					type: 'error',
					message: "" + error
				};

				cent.sendToUser(streamerID, data);
			}
		});
	});
}