sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("GlAccountsWiki.GlAccountsWiki.controller.DashBoard", {
		onInit: function () {
			var dashboardModel = new JSONModel();
			this.getView().setModel(dashboardModel, "dashboardModel");
			this.getView().getModel("dashboardModel").setProperty("/isLock", true);
			this.getOwnerComponent().getModel("dashBoardModel").setProperty("/panelExpanded", true);
			var oSideNav = this.byId("idOutsysytemSideNav");
			var sKey = "dashboard";
			// oSideNav.setSelectedKey(sKey);
			// oSideNav.fireItemSelect();
			var oNavList = this.getView().byId("appsNavList");
			oNavList.setSelectedItem(oNavList.getItems()[0]);
			this.getOwnerComponent().getModel("dashBoardModel").setProperty("/selectedModule", "HyperionAccountMapping");

		},
		onAfterRendering: function () {
			var oSideNav = this.byId("idOutsysytemSideNav");
			var oToolBar = this.byId("idoutsystemToolPage");
			this.onToolPageSidePanelExpand();
			oSideNav.$().hover(() => {
				if (this.getView().getModel("dashboardModel").getProperty("/isLock")) {
					oToolBar.setSideExpanded(true);
					this.onToolPageSidePanelExpand();

				}
			}, () => {
				if (this.getView().getModel("dashboardModel").getProperty("/isLock")) {
					oToolBar.setSideExpanded(false);
					this.onToolPageSidePanelExpand();
				}
			});

		},
		onToolPageSidePanelExpand: function (oEvent) {
			var toolPage = this.byId("idoutsystemToolPage");
			var oSidePanelMain = this.byId("idOutsysytemSideNav");
			var oAppNavList = this.byId("appsNavList");
			var oAppNavList1 = this.byId("appsNavList1");
			if (toolPage.getSideExpanded()) {
				oSidePanelMain.addStyleClass("iopV2SidePanelBgColor");
				oAppNavList.addStyleClass(
					"	iopV2SidePanelActive iopV2SidePanelTextIconColor iopV2SidePanelSelected iopV2SidePanelBgColor iopV2SidePanelNoBorder");
				oAppNavList1.addStyleClass(
					"	iopV2SidePanelActive iopV2SidePanelTextIconColor iopV2SidePanelSelected iopV2SidePanelBgColor iopV2SidePanelNoBorder");
			} else {
				oSidePanelMain.removeStyleClass("iopV2SidePanelBgColor");
				oAppNavList.removeStyleClass(
					"	iopV2SidePanelActive iopV2SidePanelTextIconColor iopV2SidePanelSelected iopV2SidePanelBgColor iopV2SidePanelNoBorder");
				oAppNavList1.removeStyleClass(
					"iopV2SidePanelActive iopV2SidePanelTextIconColor iopV2SidePanelSelected iopV2SidePanelBgColor iopV2SidePanelNoBorder");
			}
		},
		OnLockPress: function (oEvent) {
			var oSideNav = this.byId("idOutsysytemSideNav");
			var oToolBar = this.byId("idoutsystemToolPage");
			if (oEvent === "true") {
				oToolBar.setSideExpanded(false);
				this.onToolPageSidePanelExpand();
			}
			var oSidePanelMain = this.byId("sideNavigationMain");
			if (this.getView().getModel("dashboardModel").getProperty("/isLock") === false) {
				this.getView().getModel("dashboardModel").setProperty("/isLock", true);
			} else {
				this.getView().getModel("dashboardModel").setProperty("/isLock", false);
			}
		},

		handleNav: function (evt) {
			// var oSelectedModule = evt.getSource().getSelectedKey();
			var oSelectedModule = evt.getSource().getSelectedItem().split("--")[1];
			var oNavList = this.getView().byId("appsNavList");
			var navCon = this.byId("crtNavCon");
			var target = evt.getParameter("item").getKey();
			if (target && target !== "Lock") {
			} else if (target && target === "Lock") {
				this.OnLockPress("true");
			} 
			switch (oSelectedModule) {
			case "dashboard":
				this.getOwnerComponent().getModel("dashBoardModel").setProperty("/selectedModule", "dashboard");
				toolPageNavContainer.to(this.createId("root"));
				oNavList.setSelectedItem(oNavList.getItems()[0]);
				var oHeader = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("dash");
				this.getOwnerComponent().getModel("dashBoardModel").setProperty("/headerText", oHeader);
				break;
			}
		},

		doAjax: function (sUrl, sMethod, oData, rSuccess, rError) {
			if (oData) {
				oData = JSON.stringify(oData);
			}
			var tempJsonModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(tempJsonModel, "tempJsonModel");
			tempJsonModel.loadData(sUrl, oData, true, sMethod, false, false, {
				"Content-Type": "application/json;charset=utf-8"
			});
			tempJsonModel.attachRequestCompleted(function (oEvent) {
				rSuccess(oEvent.getSource().getData());
			}.bind(rSuccess));
			tempJsonModel.attachRequestFailed(function (oEvent) {
				rError(oEvent);
			}.bind(rError));

		},
		// _createConfirmationMessage: function (confirmTitle, confirmMsg, sState, confirmYesBtn, confirmNoBtn, actionButtonVisible,
		// 	closehandler) {
		// 	this.closehandler = closehandler;
		// 	if (confirmMsg === "parsererror") {
		// 		confirmMsg = "The user session has timed out. Please refresh the page";
		// 	}
		// 	this.oConfirmDialog = new Dialog({
		// 		title: confirmTitle,
		// 		type: 'Message',
		// 		state: sState,
		// 		content: new Text({
		// 			text: confirmMsg
		// 		}),
		// 		beginButton: new Button({
		// 			text: confirmYesBtn,
		// 			visible: actionButtonVisible,
		// 			press: function () {
		// 				if (closehandler !== null) {
		// 					this.closehandler();
		// 				}

		// 				this.oConfirmDialog.close();
		// 			}.bind(this)
		// 		}),
		// 		endButton: new Button({
		// 			text: confirmNoBtn,
		// 			press: function () {
		// 				this.oConfirmDialog.close();
		// 			}.bind(this)
		// 		}),
		// 		afterClose: function () {
		// 			this.oConfirmDialog.destroy();
		// 			this.oConfirmDialog = undefined;
		// 		}.bind(this)
		// 	}).addStyleClass("sapUiSizeCompact");
		// 	this.oConfirmDialog.open();
		// }
	});
});