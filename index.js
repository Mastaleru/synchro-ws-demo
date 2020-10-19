const express = require('express')
const app = express();
const port = 3000;
let isExecuting = false;
let Queue = [];


let handler = (req, res) => {
	if (isExecuting) {
		return Queue.push({request: req, response: res});
	}
	isExecuting = true;
	processRequest(req, res);
}


let processRequest = (request, response) => {

	//simulate async work with various complexity time up to 3 seconds
	let timeout = Math.floor(Math.random() * 3000);
	setTimeout(() => {
		response.send("Finished execution on " + request.query.id + " in " + timeout + " ms");
		if (Queue.length > 0) {
			let nextRequest = Queue.shift();
			processRequest(nextRequest.request, nextRequest.response);
			return;
		}
		isExecuting = false;

	}, timeout);

}


app.get('/api', handler);
app.get('/', (req, res) => {
	res.set({
		'Content-Type': 'text/html'
	});
	res.send('<!DOCTYPE html><html>' +
		'<head>' +
		'<script>' +
		'for(let i=0; i<10; i++){' +
		'fetch("http://localhost:3000/api?id="+i).then(response=>response.text().then(data=>console.log(data)))' +
		'}' +
		'setTimeout(()=>{' +
		'for(let i=10; i<20; i++){' +
		'fetch("http://localhost:3000/api?id="+i).then(response=>response.text().then(data=>console.log(data)))' +
		'}'+
		'},5000)'+
		'</script>' +
		'</head>' +
		'</html>')
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
