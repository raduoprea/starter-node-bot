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
        bot.reply(message, 'Hola back!')
    })

    wit.hears('next_task', 0.5, function(bot, message, outcome) {

        tasks.nextTask (function (error, msg) {
            if (error) {
                bot.reply(message, 'There was a problem.');
            }
            bot.reply(message, msg);
        });
    })

    wit.hears('tasks_for_today', 0.5, function(bot, message, outcome) {
        bot.reply(message, 'Here is a list of your tasks for today.');
    })

})