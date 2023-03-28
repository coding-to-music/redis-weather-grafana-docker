const Redis = require('ioredis');

const redisClient = new Redis();

// Get the number of keys in Redis before setting a new key
redisClient.keys('*', (err, keys) => {
  console.log(`Number of keys before: ${keys.length}`);

  // Generate a unique identifier using the current timestamp
  const id = `mykey_${new Date().getTime()}`;

  // Set the value of the key to the current date and time in human-readable format
  const now = new Date();
  const datetime = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  redisClient.set(id, datetime);

  // Retrieve the value of the key and print it to the console
  redisClient.get(id, (err, result) => {
    console.log(result);

    // Get the number of keys in Redis after setting a new key
    redisClient.keys('*', (err, keys) => {
      console.log(`Number of keys after: ${keys.length}`);

      // Retrieve the value of the key and print it to the console
      redisClient.get(id, (err, result) => {
        console.log(result);

        // Retrieve all key-value pairs in Redis
        redisClient.keys('*', (err, keys) => {
          redisClient.mget(keys, (err, values) => {
            // Combine keys and values into an object and print to console
            const keyValuePairs = {};
            for (let i = 0; i < keys.length; i++) {
              keyValuePairs[keys[i]] = values[i];
            }
            console.log(keyValuePairs);

            // Close the Redis client connection
            redisClient.quit();
          });
        });
      });
    });
  });
});