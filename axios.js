const https = require("https")
const dotenv = require('dotenv');
const axios = require("axios");

dotenv.config();

class AxiosV2 {
    constructor () {
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false
        });

        this.token = process.env.TOKEN_PUSAT;
        this.axiosInstance = axios.create({
            timeout: 60000,
            headers: {
                "x-auth-token": this.token
            },
            httpsAgent
        });
    }

    async get (url, params) {
        try {
            return await this.axiosInstance.get(
                url,
                {
                    params,
                }
            ).then((res) => res.data)
        } catch (error) {
            console.log("[ERROR] AxiosPusat: ", url, err.response?.data?.message || err.response?.data || err.message);
            throw new Error(err.response?.data?.message || err.response?.data);
        }
    }

    async post (url, body) {
        try {
            return await this.axiosInstance.post(
                url,
                body
            ).then((res) => res.data);
        } catch (error) {
            console.log("[ERROR] AxiosPusat: ", url, err.response?.data?.message || err.response?.data || err.message);
            throw new Error(err.response?.data?.message || err.response?.data);
        }
    }
}

const Axios = new AxiosV2();

module.exports = {
    Axios,
};