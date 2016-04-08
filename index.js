var Botkit = require('botkit')
var Witbot = require('witbot')
var token = process.env.SLACK_TOKEN
var witbot = Witbot(process.env.WIT_TOKEN)
var controller = Botkit.slackbot({ debug: false });
var tasks = require('./tasks')();

if (token) {
  console.log("Starting in single-team mode")
  controller.spawn({
    token: token
  }).startRTM(function(err, bot, payload) {
    if (err) {
      throw new Error(err);
    }
  });
} else {
  console.log("Starting in Beep Boop multi-team mode")
  require('beepboop-botkit').start(controller, { debug: true })
}

controller.hears('.*', 'direct_message,direct_mention', function(bot, message) {
  var wit = witbot.process(message.text, bot, message)

  wit.hears('greetings', 0.5, function(bot, message, outcome) {
    bot.reply(message, 'Hello to you too!')
  })

  wit.hears('next_task', 0.5, function(bot, message, outcome) {
    bot.reply(message, 'Let me check..');
    bot.startTyping(message);
    tasks.nextTaskForUser( 'me', 1, function(error, msg) {
      if (error) {
        bot.reply(message, 'There was a problem: ' + error);
      } else {
        bot.reply(message, 'Go get them, tiger:\n' + msg);
      }

    });
  })

  wit.hears('tasks_for_today', 0.5, function(bot, message, outcome) {
    bot.reply(message, 'Just a moment..');
    bot.startTyping(message);
    tasks.nextTaskForUser( 'me', 0, function(error, msg) {
      if (error) {
        bot.reply(message, 'There was a problem: ' + error);
      } else {
        bot.reply(message, 'This is the list for today:\n' + msg);
      }

    });
  })

})