const axios = require("axios")
const fs = require('fs')
module.exports = {
	async deviceGenerate() {
		if(!fs.existsSync(`./deviceauth.json`)) { // checks if deviceauth.js file exists
			const input = prompt("Authorization Code ");
			console.log(input)
			const response = await axios({
					method: 'post',
					url: 'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token',
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'Authorization': 'Basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE=',
					},
					data: `grant_type=authorization_code&code=${input}`
				}).catch(function(error) {
					throw "The Authorization Code You Submitted Is Invalid"
				}) // generates a access_token
			const response2 = await axios({
					method: 'post',
					url: 'https://account-public-service-prod.ol.epicgames.com/account/api/public/account/' + response.data.account_id + `/deviceAuth`,
					headers: {
						'Authorization': `Bearer ${response.data.access_token}`
					},
					data: {}
				}) // generates a device auth
			let info;
			info = {
				secret: response2.data.secret,
				deviceid: response2.data.deviceId,
				accountId: response.data.account_id,
			}
			let data = JSON.stringify(info);
			fs.writeFileSync('deviceauth.json', data) // creates deviceauth.json
		} else {
			let devicedata = fs.readFileSync('deviceauth.json');
			let info = JSON.parse(devicedata);
			const response = await axios({
					method: 'post',
					url: 'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token',
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'Authorization': 'Basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE=',
					},
					data: `grant_type=device_auth&account_id=${info.accountId}&device_id=${info.deviceid}&secret=${info.secret}`
				}).catch(function(error) {
					fs.unlinkSync('deviceauth.json')
					throw "Please Run The Script Again"
				}) // uses device auth file to generate a access_token
			return response.data;
		}
	}
};
