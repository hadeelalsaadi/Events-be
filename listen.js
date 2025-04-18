const dotenv = require("dotenv");
dotenv.config({ path: './.env.googleCalender' });
const app = require("./app.js");
const port = process.env.PORT;
console.log(port)

app.listen(port, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Serever is litening on ${port}!`);
    }
  });