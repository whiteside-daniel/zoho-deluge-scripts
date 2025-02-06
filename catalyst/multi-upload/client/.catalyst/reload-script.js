const reloadSocket = new WebSocket('ws://localhost:5001/client-reload');

reloadSocket.onopen = () => {
	console.log('Connection established with the server');
	reloadSocket.send('connected');
};

reloadSocket.onmessage = (message) => {
	if (message.data === 'reload') {
		reloadSocket.close();
		window.location.reload();
	}
};

reloadSocket.onclose = () => {
	console.log('connection closed');
};

reloadSocket.onerror = (err) => {
	console.error('Reload error: ', err);
};
