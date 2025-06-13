const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Axios } = require('./axios');

dotenv.config();

const app = express()
const port = process.env.PORT;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
    );
    next();
});

app.post('/copy-nota', async (req, res) => {
    try {
        const { ip_from, ip_to, type } = req.body;
        if (!ip_from || ip_from === "") throw new Error("ip_from is required");
        if (!ip_to || ip_to === "") throw new Error("ip_to is required");
        if (!type || type === "") throw new Error("Type must provided");

        const nota = await Axios.get(`${ip_from}/api/v1/nota/get-copy`, { type });
        console.log(nota);
        await Axios.post(`${ip_to}/api/v1/nota/save-copy`, { data_nota: nota, type });
        res.status(200).send("Copy Nota Success");
    } catch (error) {
        console.log(error);
        res.status(500).send(`${error}`);
    }
});

app.post('/syncronize-master', async (req, res) => {
    try {
        const { ip_pusat, selected_toko } = req.body;
        if (!ip_pusat || ip_pusat === "") throw new Error("ip_pusat is required");

        const cabangRaw = await Axios.post(`${ip_pusat}/api/v1/tokos/find-by`, { kode_toko: selected_toko });
        const baki = await Axios.get(`${ip_pusat}/api/v1/baki/get/all`);
        const data_group = await Axios.get(`${ip_pusat}/api/v1/group/get/all`);
        const dept_data = await Axios.get(`${ip_pusat}/api/v1/jenis/get/all`);
        const gudang = await Axios.get(`${ip_pusat}/api/v1/gudang/get/all`);
        const paraPembelian = await Axios.get(`${ip_pusat}/api/v1/parabeli/get/all`);
        const paraKondisi = await Axios.get(`${ip_pusat}/api/v1/parakondisi/get/all`);

        const cabangs = cabangRaw.filter((data) => data.tipe_toko === "OFFLINE");

        Promise.all(
            cabangs.map(async (cabang) => {
                const url = `${cabang.portal}/api/v1`;

                await Axios.post(`${url}/baki/syncronize`, { baki_data: baki });
                await Axios.post(`${url}/group/syncronize`, { data_group });
                await Axios.post(`${url}/jenis/syncronize`, { dept_data });
                await Axios.post(`${url}/gudang/syncronize`, { gudang });
                await Axios.post(`${url}/parabeli/syncronize`, { paraPembelian });
                await Axios.post(`${url}/parakondisi/syncronize`, { paraKondisi });

                console.log(`Syncronize on ${cabang.kode_toko} Success`)
            })
        );

        res.status(200).send("Syncronize Success");
    } catch (error) {
        console.log(error);
        res.status(500).send(`${error}`);
    }
})

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});