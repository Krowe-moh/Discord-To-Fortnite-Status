const axios = require("axios");
const prompt = require('prompt');
const fs = require('fs');
const authUrl = 'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token';
const deviceAuthUrl = (accountId) => `https://account-public-service-prod.ol.epicgames.com/account/api/public/account/${accountId}/deviceAuth`;
const authHeader = {
    'content-type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic NTIyOWRjZDNhYzM4NDUyMDhiNDk2NjQ5MDkyZjI1MWI6ZTNiZDJkM2UtYmY4Yy00ODU3LTllN2QtZjNkOTQ3ZDIyMGM3'
};

module.exports = {
    async deviceGenerate() {
        if (!fs.existsSync(`./deviceauth.json`)) {
            return await this.requestAuthorization();
        } else {
            return await this.useStoredAuth();
        }
    },

    async requestAuthorization() {
        prompt.start();
        const { input: authCode } = await prompt.get([{ name: "input", description: "Authorization Code" }]);

        try {
            const tokenResponse = await axios.post(authUrl, `grant_type=authorization_code&code=${authCode}`, { headers: authHeader });
            const accountId = tokenResponse.data.account_id;

            const deviceResponse = await axios.post(deviceAuthUrl(accountId), {}, {
                headers: { 'Authorization': `Bearer ${tokenResponse.data.access_token}` }
            });

            const deviceInfo = {
                secret: deviceResponse.data.secret,
                deviceId: deviceResponse.data.deviceId,
                accountId
            };

            fs.writeFileSync('deviceauth.json', JSON.stringify(deviceInfo));
            return deviceInfo;

        } catch (error) {
            throw new Error("Invalid Authorization Code. Please try again.");
        }
    },

    async useStoredAuth() {
        const deviceData = JSON.parse(fs.readFileSync('deviceauth.json'));

        try {
            const response = await axios.post(authUrl, `grant_type=device_auth&account_id=${deviceData.accountId}&device_id=${deviceData.deviceId}&secret=${deviceData.secret}`, {
                headers: authHeader
            });
            return response.data;
        } catch (error) {
            fs.unlinkSync('deviceauth.json');
            throw new Error("Stored device auth incorrect. Please run the script again.");
        }
    }
};
