//const dotenv = require("dotenv");
//dotenv.config({ path: './.env.googleCalender' });
const app = require("./app.js");
//const port = process.env.PORT;
const { PORT = 8080 } = process.env;

app.listen(PORT, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Serever is litening on ${PORT}!`);
    }
  });