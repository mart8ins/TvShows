const axios = require("axios");

// request options - auth key
const options = {
    auth: {
        username: "mart8ins",
        password: process.env.TV_API_KEY
    }
}

async function getData(endpoint){
    try{
        const response = await axios.get("http://api.tvmaze.com/" + endpoint, options);
        return response.data;
    } catch(err){
        console.log(err)
    }
}

module.exports = {
    getData
}