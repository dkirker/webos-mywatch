function DashboardAssistant() {
}

DashboardAssistant.prototype.setup = function() {
	this.iconHandler = this.pingWatch.bindAsEventListener(this);
	this.textHandler = this.relaunchApp.bindAsEventListener(this);
	this.controller.listen("dashicon", Mojo.Event.tap, this.iconHandler);
	this.controller.listen("dashtext", Mojo.Event.tap, this.textHandler);

	var cookie = new Mojo.Model.Cookie("LastInfo");
	var info = cookie.get();
	var cookie = new Mojo.Model.Cookie("LastMsg");
	var msg = cookie.get();
};

DashboardAssistant.prototype.pingWatch = function() {
	this.controller.serviceRequest("palm://com.palm.applicationManager", {
		method: "open",
		parameters: {
			id: myAppId,
			params: {command: "PING"}
		}
	});
};

DashboardAssistant.prototype.relaunchApp = function() {
	this.controller.serviceRequest("palm://com.palm.applicationManager", {
		method: "open",
		parameters: {
			id: myAppId
		}
	});
};

DashboardAssistant.prototype.showInfo = function(logText, open) {
	this.controller.get('log-output').innerHTML = "<strong>" + logText + "</strong><br />" + this.controller.get('log-output').innerHTML.substr(0, 300) + "<br /><br />";
	this._refreshIcon(open);
};

DashboardAssistant.prototype.logInfo = function(logText, open) {
	this._refreshIcon(open);
};

DashboardAssistant.prototype._refreshIcon = function(open) {
	var signalDiv = this.controller.get('log-signal');
	if (open) {
		signalDiv.removeClassName("disconnected");
		signalDiv.addClassName("connected");
	} else {
		signalDiv.removeClassName("connected");
		signalDiv.addClassName("disconnected");
	}
};

DashboardAssistant.prototype.considerForNotification = function(event) {
	Mojo.Log.error("considerForNotification");
};

DashboardAssistant.prototype.activate = function(event) {
	Mojo.Log.error("dashboard activate");
	this.logInfo(null, lastLoggingConnectionStatus);
};

DashboardAssistant.prototype.deactivate = function(event) {
	Mojo.Log.error("dashboard deactivate");
};

// Close the dashboard
DashboardAssistant.prototype.cleanup = function() {
	var appController = Mojo.Controller.getAppController();
	appController.closeStage("dashboard");
	this.controller.stopListening("dashicon", Mojo.Event.tap, this.iconHandler);
	this.controller.stopListening("dashtext", Mojo.Event.tap, this.textHandler);
};
