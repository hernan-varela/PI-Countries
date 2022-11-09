const axios = require('axios')
const {Country, TouristActivity } = require('../db')

//retorna un arreglo con todas los paises 
 const getAllCountries = async() => {
    const getAllData = await axios.get('https://restcountries.com/v3/all')
    const dataFiltered = await getAllData.data.map(country => {
        return{
            id : country.cca3,
            flag : country.flags[1],
            name : country.name.common,
            continent : country.continents[0],
            capital : country.capital? country.capital[0] : 'capital not found', // hay algunos paises que no traen capital en la api
            subregion : country.subregion? country.subregion : 'subregion not found',
            area : country.area,
            population : country.population,
        }
    })

    return dataFiltered;
}


//guarda todos los paises en la base de datos
const sabeToDataBase = async () =>{
    const allCountries = await getAllCountries()     // me traigo la lista de paises dedsde la api
    for (const c of allCountries ) {
        await Country.findOrCreate({
            where:{

                
                id : c.id,
                name : c.name.toLowerCase(), //para poder ingresar en minusculas o mayusculas
                img_flag : c.flag,
                continent : c.continent,
                capital : c.capital,
                subregion : c.subregion,
                area : c.area,
                population : c.population
            }
        })
    }
}


//retorna todos los paises de la base de datos
const getAllCountriesToDB = async () =>{
    await sabeToDataBase()
    const allCountries = await Country.findAll({
        attributes : ['id','name', 'img_flag', 'continent'], // traigo solo los atributos para la ruta principal
        
    })
    return allCountries
}



//retorna un pais por su nombre desde la base de datos
const getCountryByName = async (name) => {
    const country = await Country.findOne({
        attributes : ['id','name', 'img_flag', 'continent'], 
        where : {
            name : name.toLowerCase()     //para poder ingresar en minusculas o mayusculas
        }
    })

    return country
}



//retorna el detalle de un pais a traves de un id
const getCountryDetails = async (id) => {
    const country = await Country.findOne({
        where : {id : id},
        include : {
            model : TouristActivity,
            through : {atributes : []}      //dejo vacio el array attributes de la carga ansiosa para que no me incluya los modelos asociasdos es decir las foreing key
        }
    })

    return country;
}

// //guarda las actividades turisticas en la base de datos 
// const sabeActivityTodb = async (name, difficulty, duration, season, countries) => {
//     const listCountries = []
//     const activity = await TouristActivity.create({
//         where : { name, difficulty, duration, season }
//     })
    
//     for (const c of countries) {  
//         const foundCountry = await Country.findOne({where : {name : c}})
//         if(foundCountry) listCountries.push(foundCountry)
//     }

//     for (const c of listCountries ) {
//         console.log(activity.name, 'caaaaaaa')
//         activity.addCountry(c)
//     }
// }


//asocia 






module.exports = {
    getAllCountriesToDB,
    getCountryByName,
    getCountryDetails,
   
}