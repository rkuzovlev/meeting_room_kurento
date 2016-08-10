import kurento from 'kurento-client';
import config from 'config';

var kurentoClient = null;

export let initKurento = function(){
	return new Promise(function(resolve, reject){
		if (kurentoClient){
			return resolve(kurentoClient);
		}

		kurento(config.get('kurento.url'), function(error, _kurentoClient) {
			if (error) {
				return reject(error);
			}

			kurentoClient = _kurentoClient;
			resolve();
		});
	});
}

export let getKurento = function(){
	if (kurentoClient){
		return kurentoClient;
	}

	throw new Error('kurento is not initialized, use initKurento before');
}

export { kurento }