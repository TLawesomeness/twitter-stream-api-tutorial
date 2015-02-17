var MongoClient = require('mongodb').MongoClient
, assert = require('assert');

var Mailgun = require('mailgun').Mailgun;
var mg = new Mailgun(process.env.MG_KEY);

var sendMail = function(numberOfTweets, tweetsText) {
  mg.sendText(process.env.EMAIL,
    process.env.EMAIL,
    numberOfTweets + "new tweets",
    tweetsText,
    function(err) {
      if (err) console.log('Oh noes: ' + err);
      else     console.log('Success');
    });
  };

  var url = process.env.MONGO_URL;

  var tweetText = function(tweet) {
    return '@' + tweet.user.screen_name + ': ' + tweet.text;
  };

  var tweetUrl = function(tweet) {
    return 'http://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str;
  };

  var handleTweets = function(tweets) {
    var emailBody = '';
    var tweetsText = tweets.map(function(tweet) {
      return tweetText(tweet) +  ' | ' + tweetUrl(tweet);
      // return '@' + tweet.user.screen_name + ':' + tweet.text;
    }).join('\n\n');
    sendMail(tweets.length, tweetsText);
    // console.log(tweetsText);
  };

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log('Connected correctly to server');

    setInterval(function() {
      console.time(new Date() + "Working...");
      var collection = db.collection('tweets');
      collection.find({}).toArray(function(err, tweets) {
        assert.equal(err, null);
        console.log(tweets.length);
        if (tweets.length) {
          handleTweets(tweets);
        }
        // collection.remove(function() { db.close() });
        collection.remove(function() {});
      });
    }, 20 * 1000);
  });
