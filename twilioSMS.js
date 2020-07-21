var botId = "st-ead33cbc-bcd7-5c42-a6c0-99a953189077";
var botName = "ivr sandbox";
var sdk            = require("./lib/sdk");
var Promise        = sdk.Promise;
var request        = require("request");
var config         = require("./config");
//Twitio configurations
var twilio = require('twilio');
var accountSid = 'ACdc2915b1d4e5d087cafec37dedc07cd6'; // Your Account SID from www.twilio.com/console
var authToken = '231af697098494f333383e6c03d8fb9f';   // Your Auth Token from www.twilio.com/console

module.exports = {
	botId   : botId,
	botName : botName,
	 on_user_message : function(requestId, data, callback) {
		sdk.sendBotMessage(data, callback);
		console.log("###request id: " + requestId);
		console.log("on_user_message ==> " + data.message);
	},
	on_bot_message  : function(requestId, data, callback) {
		sdk.sendUserMessage(data, callback);
		console.log("###request id: " + requestId);
		console.log("on_bot_message ==> " + data.message);
	},
	on_webhook      : function(requestId, data, componentName, callback) {
		console.log("###request id: " + requestId);
		var context = data.context;
		if (componentName === 'sendText') {
			var smsClient = new twilio(accountSid, authToken);
			var text;
			console.log("on_webhook ==> calling API for hookCallAPIFromBotkit");
			console.log("wait on... " + new Date());
			console.log("Userid:@@@@@@: ", JSON.stringify(data.context.session.UserContext));
			console.log("Bot User Session:$$$$$$$$$: ", data.context.session.BotUserSession);
			sdk.saveData(requestId, data).then(function() {
				if(data.context.smsText){
					text = data.context.smsText;
				} else {
					var response = data.context.BillingSummary.response.body.retrievePolicyBillingSummariesResponse.billingSummaries;
					var policynum=response.policyBillingSummary[0].policy.policyNumber;
					var endingnum=policynum.substr(9,13);
					text = "As of today you have a total balance of $"+response.policyBillingSummary[0].billingSummary.payOffAmount+ " and a minimum of $ "+
response.policyBillingSummary[0].billingSummary.currentBalance +" was due on "+response.policyBillingSummary[0].billingSummary.bill.dueDate 
+" on your policy ending in "+endingnum;
				};
				var ani = data.context.session.BotUserSession.ivr.ani;
				ani = ani.split('@');
				ani = '+1'+ani[0];
				console.log("User ANI#### ",ani);
				console.log("User text: ", text)
				smsClient.messages.create({
    				body: text,
    				to: ani,  // Text this number
    				messagingServiceSid: 'MG86f2da6572094b47b1ea137a7244c2b9', // From a valid Twilio messageService id
				}).then((twilioResp) => {
					data.context.twilioResp = twilioResp;
					//console.log(twilioResp)
					sdk.respondToHook(data)
					console.log("wait done... " + new Date());
				});
				callback(null, new sdk.AsyncResponse());
			});
		}        
	},
	on_agent_transfer : function(requestId, data, callback){
		return callback(null, data);
	}
};