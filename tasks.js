var asana = require('asana');
var request = require('request');
var util = require('util');

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
    
    client.users.me()
      .then(function(user) {
        var userId = user.id;
        console.log('userId: ' + userId);
        
        // The user's "default" workspace is the first one in the list, though
        // any user can have multiple workspaces so you can't always assume this
        // is the one you want to work with.
        var workspaceId = user.workspaces[0].id;
        console.log('workspaceId: ' + workspaceId);
        
        return client.tasks.findAll({
          assignee: userId,
          workspace: workspaceId,
          completed_since: 'now',
          opt_fields: 'id,name,assignee_status,completed'
        });
      })
      .then(function(response) {
        // There may be more pages of data, we could stream or return a promise
        // to request those here - for now, let's just return the first page
        // of items.
        return response.data;
      })
      .filter(function(task) {
        return task.assignee_status === 'today';
      })
      .then(function(list) {
        console.log(util.inspect(list, {
          colors: true,
          depth: null
        }));
      });
    
    // var url = 'https://app.asana.com/api/1.0/tasks?workspace='+ workspaceId +
    //           '&assignee=' + user;
    
    // request(url, function(error, response, body) {
    //   if (!error && response.statusCode == 200) {
    //     console.log(body)
    //     fn(null, body);
    //   }
    // })
  }

}