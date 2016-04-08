var request = require('request');
var asana = require('asana');
var clientId = process.env.ASANA_CLIENT_ID;
var clientSecret = process.env.ASANA_CLIENT_SECRET;
var personalAccessToken = process.env.ASANA_TOKEN;
var workspaceId = process.env.ASANA_WORKSPACE_ID

module.exports = function() {
  return new NextTask();
}

function NextTask() {
  var self = this;

  self.nextTaskForUser = function(user, fn) {
    var client = asana.Client.create().useAccessToken(personalAccessToken);
    var url = 'https://app.asana.com/api/1.0/tasks?workspace='+ workspaceId +
              '&assignee=' + user;
    
    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body)
        fn(null, body);
      }
    })
    
    // client.users.me().then(function(me) {
    //   fn(null, me);
    // });
  }

}