const app = require('./app');
const env = require('dotenv');
env.config({ path: './.env' });

// console.log(process.env);

app.listen(8000, () => {
  console.log('app successfully connected');
});
