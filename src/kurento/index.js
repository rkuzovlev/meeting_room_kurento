import * as storage from './storage';
import * as api from './api';

export let newBroadcaster = function(broadcastID, streamerID, sdpOffer){
	console.log('newBroadcaster', broadcastID, streamerID, sdpOffer);

	return api.createMediaPipeline(broadcastID)
		.then(() => api.createWebRtcEndpoint(broadcastID, streamerID))
		.then(() => api.configureStreamerWebRtcEndpoint(broadcastID, streamerID, sdpOffer))
}

export let newCandidate = function(broadcastID, streamerID, candidate){
	console.log('newCandidate', broadcastID, streamerID, candidate);
	
	return api.newCandidate(broadcastID, streamerID, candidate);
}

export { initKurento, getKurento } from './kurento'