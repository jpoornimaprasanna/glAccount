/*global Plotly*/
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	
], function (Controller, JSONModel, MessageBox, MessageToast) {

	"use strict";

	return Controller.extend("GlAccountsWiki.GlAccountsWiki.controller.BaseController", {
		_createConfirmationMessage: function (confirmTitle, confirmMsg, sState, confirmYesBtn, confirmNoBtn, actionButtonVisible,
			closehandler) {
			this.closehandler = closehandler;
			if (confirmMsg === "parsererror") {
				confirmMsg = "The user session has timed out. Please refresh the page";
			}
			this.oConfirmDialog = new sap.m.Dialog({
				title: confirmTitle,
				type: 'Message',
				state: sState,
				content: new Text({
					text: confirmMsg
				}),
				beginButton: new sap.m.Button({
					text: confirmYesBtn,
					visible: actionButtonVisible,
					press: function () {
						if (closehandler !== null) {
							this.closehandler();
						}

						this.oConfirmDialog.close();
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: confirmNoBtn,
					press: function () {
						this.oConfirmDialog.close();
					}.bind(this)
				}),
				afterClose: function () {
					this.oConfirmDialog.destroy();
					this.oConfirmDialog = undefined;
				}.bind(this)
			}).addStyleClass("sapUiSizeCompact");
			this.oConfirmDialog.open();
		},

	});

});