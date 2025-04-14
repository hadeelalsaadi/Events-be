const app = require("./app.js");
const { PORT = 8000 } = process.env;

app.listen(PORT, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Serever is litening on ${PORT}!`);
    }
  });