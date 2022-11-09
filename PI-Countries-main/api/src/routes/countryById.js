const express = require('express');
const utils = require('./utils');
const router = express.Router();


router.get('/:id', async (req,res) => {
   try {
    const {id} = req.params;

    if(id){
        const country = await utils.getCountryDetails(id)
        country ? res.status(201).json(country) : res.status(405).send({error : 'the country you are looking for does not exist'})
    }
   } catch (error) {
        res.status(405).send({error : error.messagge})
   }

});


module.exports = router;