const axios = require("axios");
const fs = require("fs").promises;
const readline = require("readline");
const chalk = require("chalk");
const cliProgress = require("cli-progress");

const AUTH_URL = "https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token";
const DEVICE_AUTH_URL = (accountId) => `https://account-public-service-prod.ol.epicgames.com/account/api/public/account/${accountId}/deviceAuth`;
const DEVICE_AUTH_FILE = "deviceauth.json";

const getAuthHeaders = () => ({
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": "Basic M2Y2OWU1NmM3NjQ5NDkyYzhjYzI5ZjFhZjA4YThhMTI6YjUxZWU5Y2IxMjIzNGY1MGE2OWVmYTY3ZWY1MzgxMmU="
});

const askQuestion = (query) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(chalk.cyan(query), answer => {
        rl.close();
        resolve(answer.trim());
    }));
};

const showProgress = async (task, message = "Processing") => {
    const bar = new cliProgress.SingleBar({ format: `${chalk.blue(message)} | {bar} | {percentage}%` }, cliProgress.Presets.shades_classic);
    bar.start(100, 0);

    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        bar.update(progress);
        if (progress >= 100) {
            clearInterval(interval);
            bar.stop();
        }
    }, 200);

    const result = await task();
    clearInterval(interval);
    bar.stop();
    return result;
};

async function deviceGenerate() {
    try {
        await fs.access(DEVICE_AUTH_FILE);
        console.log(chalk.green("✅ Using stored authentication..."));
        return await showProgress(useStoredAuth, "Authenticating...");
    } catch {
        console.log(chalk.yellow("⚠ No stored authentication found."));
        return await requestAuthorization();
    }
}

async function requestAuthorization() {
    const authCode = await askQuestion("Enter Authorization Code: ");

    try {
        console.log(chalk.blue("🔄 Requesting access token..."));
        const { data: tokenData } = await axios.post(AUTH_URL, `grant_type=authorization_code&code=${authCode}`, { headers: getAuthHeaders() });

        console.log(chalk.blue("🔄 Generating device credentials..."));
        const { data: deviceData } = await axios.post(DEVICE_AUTH_URL(tokenData.account_id), {}, {
            headers: { "Authorization": `Bearer ${tokenData.access_token}` }
        });

        const deviceInfo = { secret: deviceData.secret, deviceId: deviceData.deviceId, accountId: tokenData.account_id };

        await fs.writeFile(DEVICE_AUTH_FILE, JSON.stringify(deviceInfo, null, 2));
        console.log(chalk.green("✅ Device authentication saved successfully."));
        return deviceInfo;

    } catch (error) {
        console.log(error.response.data);
        console.error(chalk.red("❌ Invalid Authorization Code. Please try again."));
        process.exit(1);
    }
}

async function useStoredAuth() {
    try {
        const deviceData = JSON.parse(await fs.readFile(DEVICE_AUTH_FILE));

        console.log(chalk.blue("🔄 Refreshing device authentication..."));
        const { data: authResponse } = await axios.post(AUTH_URL, 
            `grant_type=device_auth&account_id=${deviceData.accountId}&device_id=${deviceData.deviceId}&secret=${deviceData.secret}`,
            { headers: getAuthHeaders() }
        );

        console.log(chalk.green("✅ Authentication successful."));
        return authResponse;
    } catch (error) {
        console.error(chalk.red("❌ Stored authentication is invalid or expired. Re-authentication required."));
        await fs.unlink(DEVICE_AUTH_FILE);
        process.exit(1);
    }
}

module.exports = { deviceGenerate };
