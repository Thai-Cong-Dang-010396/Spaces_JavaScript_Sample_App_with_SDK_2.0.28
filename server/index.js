/* eslint-disable prettier/prettier */
const axios = require('axios').default;
const qs = require('qs');
const fetch = require('node-fetch');
const formidable = require('express-formidable');
const fs = require('fs');
const express = require('express');

const app = express();
const port = 3001;


// app.use(express.json({extented:true}));
app.use((req, res, next) => {

	res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from. For now, it takes in any value
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();

});
app.use(formidable());

const ACCOUNTS_APP_URL = process.env.REACT_APP_ENVIRONMENT === 'staging' ? 'onesnastaging.esna' : 'accounts.avayacloud';
const SPACES_APIS_URL = process.env.REACT_APP_ENVIRONMENT === 'staging' ? 'loganstagingapis.esna' : 'spacesapis.avayacloud';


// ENDPOINTS
app.post('/media_toggle', (req, res, next) => {

	const { spaceId, attendeeType, meetingId, userId, tokenType, token, mdsrvSessionId, videoMuted, audioMuted } = req.fields;
	const bodyToSend = {
		mdsrvSessionId,
		'video': !videoMuted,
		'audio': !audioMuted
	};

	fetch(`https://${SPACES_APIS_URL}.com/api/spaces/${spaceId}/meetings/${meetingId}/attendees/${attendeeType}/${userId}/mediastate`, {
		'headers': {
			'authorization': `${tokenType} ${token}`,
			'content-type': 'application/json',
		},
		'body': JSON.stringify(bodyToSend),
		'method': 'POST',
	})
		.then(response => response.json())
		.then(response => {

			console.log(response);

			return res.send(JSON.stringify(response));
		
		}).catch(err => res.send(err));
	next();

});

app.post('/access_token', (req, res) => {

	const copiedFields = { ...req.fields };

	delete copiedFields.accounts_app;

	const data = qs.stringify(copiedFields);
	const config = {
		method: 'post',
		url: `https://${ACCOUNTS_APP_URL}.com/oauth2/access_token`,
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		data
	};

	axios(config)
		.then((response) => res.status(response.status).send(response.data))
		.catch((error) => {

			console.log(error);
			console.log(error.response.status);

			return res.status(error.response.status).send(error.response);
		
		});

});

app.post('/upload_file', (req, res, _next) => {

	fs.readFile(req.files.selectedFile.path, function (err, file) {

		axios({
			method: 'POST',
			url: `https://${SPACES_APIS_URL}.com/api/files/getuploadurl`,
			headers:
            { 'Authorization': `${req.fields.tokenType  } ${  req.fields.token}` }, // jwt 5s1a2sa3as5...
			data: {
				'files':
                    [
                    	{
                    		'Content-Type': req.files.selectedFile.type,
                    		'Content-Length': req.files.selectedFile.size
                    	}
                    ]
			}
		}).then(response => {

			this.fileId = response.data.data[0].fileKey;

			axios({
				method: 'PUT',
				url: response.data.data[0].url,// e.g. https://storage.googleapis.com/spaces2020/logan%2Fe2607bf1....
				headers:
                {
                	'Content-Type': req.files.selectedFile.type,
                	'Content-Length': req.files.selectedFile.size,
                },
				data: file   // file as a binary object BLOB
			}).then(response => response.status === 200 ? res.send(this.fileId) : res.send(response.status))
				.catch(err => { res.send(err); });
		
		}).catch((err) => {

			res.send(err);
		
		});
	
	});

});

app.post('/edit_post', (req, res) => {

	console.log(`Fields are: ${  req.fields}`);
	const { tokenType, token, editedPost } = req.fields;
	const postId = editedPost._id;

	const data = {
		_id: editedPost._id,
		content: { ...editedPost.content, }
	};

	fetch(`https://${SPACES_APIS_URL}.com/api/messages/${postId}`, {
		'headers': {
			'authorization': `${tokenType  } ${  token}`,
			'content-type': 'application/json',
		},
		'body': JSON.stringify(data),
		'method': 'POST',
		'mode': 'cors'
	}).then(res => res.json()
	).then(resp => {

		console.log(resp);
		res.send(resp);
	
	}).catch(err => {

		console.log(err);
		res.send(err);
	
	});

});
app.post('/edit_task', (req, res) => {

	const { tokenType, token, editedTask } = req.fields;
	const taskId = editedTask._id;

	const data = {
		_id: editedTask._id,
		...editedTask
	};

	fetch(`https://${SPACES_APIS_URL}.com/api/messages/${taskId}`, {
		'headers': {
			'authorization': `${tokenType  } ${  token}`,
			'content-type': 'application/json',
		},
		'body': JSON.stringify(data),
		'method': 'POST',
		'mode': 'cors'
	}).then(res => res.json()
	).then(resp => {

		console.log(resp);
		res.send(resp);
	
	}).catch(err => {

		console.log(err);
		res.send(err);
	
	});

});

app.post('/edit_message', (req, res) => {

	const { tokenType, token, editedMessage, previousMessage } = req.fields;
	const data = {
		...previousMessage,
		content: {
			...previousMessage.content,
			bodyText: editedMessage
		}
	};

	fetch(`https://${SPACES_APIS_URL}.com/api/messages/${previousMessage._id}`, {
		'headers': {
			'authorization': `${tokenType  } ${  token}`,
			'content-type': 'application/json',
		},
		'body': JSON.stringify(data),
		'method': 'POST',
		'mode': 'cors'
	}).then(res => res.json()
	).then(resp => {

		console.log(resp);
		res.send(resp);
	
	}).catch(err => {

		console.log(err);
		res.send(err);
	
	});

});

app.post('/space_settings', (req, res) => {

	const { tokenType, token, spaceSettings, spaceId } = req.fields;

	const data = { settings: { ...spaceSettings } };

	fetch(`https://${SPACES_APIS_URL}.com/api/spaces/${spaceId}`, {
		'headers': {
			'authorization': `${tokenType  } ${  token}`,
			'content-type': 'application/json',
		},
		'body': JSON.stringify(data),
		'method': 'POST',
		'mode': 'cors'
	}).then(res => res.json()
	).then(resp => {

		res.send(resp);
	
	}).catch(err => {

		console.log(err);
		res.send(err);
	
	});

});

app.post('/preferences', (req, res) => {

	const { spaceId, isPinned, tokenType, token } = req.fields;

	const data = {
		'targetId': spaceId,
		isPinned,
	};

	fetch(`https://${SPACES_APIS_URL}.com/api/users/me/topics/${spaceId}/preference`, {
		'headers': {
			'authorization': `${tokenType  } ${  token}`,
			'content-type': 'application/json',
		},
		'body': JSON.stringify(data),
		'method': 'POST',
		'mode': 'cors'
	}).then(res => res.json()
	).then(resp => {

		console.log(`Success: ${  JSON.stringify(resp)}`);
		res.send(resp);
	
	}).catch(err => {

		console.log(err);
		res.send(err);
	
	});

});

// 
app.listen(port, () => {

	console.log(`Sample spaces app is listening at http://localhost:${port} on ${process.env.REACT_APP_ENVIRONMENT} environment`);

});



