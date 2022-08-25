const axios = require("axios")
const fs = require('fs')

module.exports = {
  async deviceGenerate() {
    try {
      if (!fs.existsSync(`./deviceauth.json`)) {
        const input = prompt("Bearer Token ");
        const response = await axios({
          method: 'post',
          url: 'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE=',
          },
          data: `grant_type=authorization_code&code=${input}`
        }).catch(function(error) {
          if (error.response.data.errorCode === 'errors.com.epicgames.account.oauth.authorization_code_not_found') {
            throw "Invalid Authorization Given"
          } else {
            throw error.response.data.errorMessage
          }
        })
        const response2 = await axios({
          method: 'post',
          url: 'https://account-public-service-prod.ol.epicgames.com/account/api/public/account/' + response.data.account_id + `/deviceAuth`,
          headers: {
            'Authorization': `Bearer ${response.data.access_token}`
          },
          data: {}
        }).catch(function(error) {
          throw "Login Again"
        })
        let info = {
          secret: response2.data.secret,
          deviceid: response2.data.deviceId,
          accountId: response.data.account_id,
        };

        let data = JSON.stringify(info);
        fs.writeFileSync('deviceauth.json', data)
        let info2 = JSON.parse(data);
        axios({
          method: 'post',
          url: 'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE=',
          },
          data: `grant_type=device_auth&account_id=${info2.accountId}&device_id=${info2.deviceid}&secret=${info2.secret}`
        }).then(function(response) {
          return response.data;
        }).catch(function(error) {
          throw "Login again"
        })
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
          throw "Delete Device auth file and login again"
        })
        return response.data;
      }
    } catch (err) {
      console.log(err)
    }
  }
};
