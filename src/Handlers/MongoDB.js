const { connect } = require("mongoose");

require("dotenv").config();

connect(process.env.mongooseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

.then(db => console.log("Listo MongoDB"))

.catch(e => console.log(e))