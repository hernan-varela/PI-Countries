const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('touristActivity', {

        name : {
            type : DataTypes.STRING(25),
            allowNull : false,
        },

        difficulty :{
            type : DataTypes.ENUM('1','2', '3', '4', '5',),
            allowNull : false
        },

        duration : {
            type : DataTypes.INTEGER,
            allowNull : false
        },

        season : {
            type : DataTypes.ENUM( 'spring', 'summer', 'autumn', 'winter' )
        }
    },{timestamps : false})
}
