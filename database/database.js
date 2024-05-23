const mongoose = require('mongoose')

// External File 
//Functions (Connection)
// Make a unique function name
// Export 

const Database = () => {
    mongoose.connect(process.env.MONGODB_LOCAL).then(() => {
        console.log('Database Connected!')
    })
}

// Exporting the function
module.exports = Database