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

  self.nextTaskForUser = function(user, numberOfTasks, fn) {
    var client = asana.Client.create().useAccessToken(personalAccessToken);
    var tasksList;
    
    client.users.me()
      .then(function(user) {
        var userId = user.id;
        
        // Get the first workspace (the default one)
        var workspaceId = user.workspaces[0].id;
        
        return client.tasks.findAll({
          assignee: userId,
          workspace: workspaceId,
          completed_since: 'now',
          opt_fields: 'id,name,assignee_status,completed'
        });
      })
      .then(function(collection) {
        // Fetch up to 1000 tasks, using multiple pages if necessary
        collection.fetch(1000).then(function(tasks) {
          return tasks;
        
      })
      .filter(function(task) {
        return task.assignee_status === 'today';
      })
      .then(function(list) {
        
        var taskList;
        if (numberOfTasks !== 0) {
          taskList = list.slice(0, numberOfTasks).map(function(task, index) {
            return (index+1) + '. ' + task.name;
          });;
        } else {
          taskList = list.map(function(task, index) {
            return (index+1) + '. ' + task.name;
          });
        }
        
        fn(null, taskList.join('\n'));
        
      });
    });
  }

}