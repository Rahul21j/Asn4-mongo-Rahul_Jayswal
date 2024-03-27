const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

function findAll() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useNewUrlParser: true })
            .then(client => {
                const db = client.db("mydb");
                const collection = db.collection('customers');
                const cursor = collection.find({}).limit(10);
                cursor.toArray()
                    .then(docs => {
                        client.close();
                        resolve(docs);
                    })
                    .catch(err => {
                        client.close();
                        reject(err);
                    });
            })
            .catch(err => {
                reject(err);
            });
    });
}

setTimeout(() => {
    findAll()
        .then(docs => {
            console.log(docs);
        })
        .catch(err => {
            console.error(err);
        });
    console.log('iter');
}, 5000);
