var Twitter = require('twitter');
var MongoClient = require('mongodb').MongoClient
, assert = require('assert');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var url = process.env.MONGO_URL;

client.stream('statuses/filter', {track: 'codinghouse, coding house'}, function(stream) {
    // var url = 'mongodb://localhost:27017/myproject';
    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");

      var collection = db.collection('tweets');
      stream.on('data', function(tweet) {
        console.log(tweet.text);
      // Insert some documents
      collection.insert(tweet, function(err, result) {
        assert.equal(err, null);
        // console.log("Inserted 3 documents into the document collection");
        // db.close();
      });

    });
  });

  stream.on('error', function(error) {
    throw error;
  });
});
