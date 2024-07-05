// API to get Countries & Cities

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const axios = require('axios');
const mongoose = require("mongoose");
const Country = require('../models/country');

mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!");
    })
    .catch((err) => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!");
        console.log(err);
    });

async function getCountries() {
  const res = await axios.get(process.env.API_URL);
  return res.data;
}

async function AddEG(){
  let cities = new Set();
  const countries = await getCountries(); 
  for(countrie of countries.geonames){
    if(countrie.fclName.includes('city') && countrie.countryCode == 'EG')
      cities.add(countrie.adminName1);
  }
  await Country.deleteMany({});
  country = new Country();
  country.name = 'Egypt';
  for (c of cities){
        country.cities.push(c);
    }
    await country.save();
}


AddEG().then(() => {
    mongoose.connection.close();
    console.log("Done");
})