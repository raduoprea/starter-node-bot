var asana = require('asana');
var clientId = process.env.ASANA_CLIENT_ID;
var clientSecret = process.env.ASANA_CLIENT_SECRET;
var personalAccessToken = process.env.ASANA_TOKEN;

module.exports = function () {
  return new NextTask();
}

function NextTask () {
    var self = this;
    
    self.nextTask = function(fn) {
        var client = asana.Client.create().useAccessToken(personalAccessToken);
        client.users.me().then(function(me) {
            console.log(me);
            fn(me);
        });
    }
      
}