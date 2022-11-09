const express = require('express');
const utils = require('./utils');
const router = express.Router();
const {Country, TouristActivity } = require('../db');
const { where } = require('sequelize');

router.get('/', async (req,res) => {
    try {
        const {name} = req.query
        if(name) {
            const country = await utils.getCountryByName(name)
            if(country) res.status(201).send(country);
            else{
                res.status(405).send({error : 'The country you are looking for does not exist, correct your search'})
            }
            
        }

        else{
            const allcountries = await utils.getAllCountriesToDB() 
            res.send(allcountries)
        }
    } catch (error) {
        res.status(405).send({error : error.messagge})
    }

})



router.post('/activities', async (req,res) => {
    try{
        let {name, difficulty, duration, season, countries} = req.body
        // Se crea la actividad
        let newActivity = await TouristActivity.create({
            name,
            difficulty,
            duration,
            season
        })

        // Reviso el array de paises para ver en cual se debe crear la actividad 
        countries.forEach(async (country) => {
            let activityCountry = await Country.findOne({
                where: {
                    name: country
                }
            }) 
            await newActivity.addCountry(activityCountry)
        });
        res.status(200).send('La actividad se creo exitosamente')
    } catch(error) {
        console.log(error)
        res.status(500).send('No se pudo crear la actividad')
    }
})

module.exports = router