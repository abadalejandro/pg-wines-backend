const server = require('./src/app');
const { conn } = require('./src/db');

const PORT = process.env.PORT || 3001;

conn.sync({ alter: true })  // Esto evita que se borren datos al reiniciarse el servidor.
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server listening at ${PORT}`);
        });
    })
    .catch(e => console.log('ERROR :( ' + e));


