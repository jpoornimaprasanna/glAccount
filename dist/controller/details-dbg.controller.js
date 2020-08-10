sap.ui.define([
	"GlAccountsWiki/GlAccountsWiki/controller/BaseController",
	"GlAccountsWiki/GlAccountsWiki/util/powerBiControls",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageToast',
	"GlAccountsWiki/GlAccountsWiki/util/formatter",
	"sap/ui/export/Spreadsheet",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/BusyDialog",

], function (Controller, PowerBiControls, JSONModel, MessageToast, Formatter, Spreadsheet, Filter, FilterOperator) {
	"use strict";
	var topCount;
	return Controller.extend("GlAccountsWiki.GlAccountsWiki.controller.details", {
		pwbi: PowerBiControls,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf GlAccountsWiki.GlAccountsWiki.view.masterViz1
		 */
		formatter: Formatter,
		onInit: function () {
			var glAccountModel = new JSONModel();
			this.getOwnerComponent().setModel(glAccountModel, "glAccountModel");
			this._setData();
			// this.mulesoftServiceCall();
			this._setPaginationHeight();
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/balanceType", "All");
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/accountGroup", "All");
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/statusActive", "Active");
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/downRecords", []);
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/indicesValues", []);
			this.tableData();
		},

		_setPaginationHeight: function () {
			var screenheight = sap.ui.Device.resize.height;
			var tasklistheight = screenheight * 0.5;
			tasklistheight = tasklistheight + "vh";
			var tasklistheight1 = screenheight * 10;
			tasklistheight1 = tasklistheight1 + "vh";
			this.getOwnerComponent().getModel("dashBoardModel").setProperty("/paginationHeight", tasklistheight);
			this.getOwnerComponent().getModel("dashBoardModel").setProperty("/paginationHeight1", tasklistheight1);
		},

		_setData: function () {
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/statusActive", "Active");
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/pageCount", "1");
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/paginationVisibility", true);
		},

		paginationVisible: function () {
			var that = this;
			var totalRecords = that.getOwnerComponent().getModel("glAccountModel").getData().totalRecords;
			var pageCount = Number(that.getOwnerComponent().getModel("glAccountModel").getData().pageCount);

			if (pageCount === 1) {
				this.getOwnerComponent().getModel("glAccountModel").setProperty("/previousButtonVisible", false);
			}
		},

		onAfterRendering: function () {
			this.tableData();
			this.paginationVisible();
			this.comboData();
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/filtersApplied", 0);
			// this.setSize();
			sap.ui.Device.resize.attachHandler(function () {
				this._setPaginationHeight();
			}.bind(this));

			var oComboBox = this.getView().byId("balanceTypeId");
			var oComboBox1 = this.getView().byId("accountGroupId");
			var oComboBox2 = this.getView().byId("idStatus");
			oComboBox.addEventDelegate({
				onAfterRendering: function () {
					oComboBox.$().find("input").attr("readonly", true);
				}
			});
			oComboBox1.addEventDelegate({
				onAfterRendering: function () {
					oComboBox1.$().find("input").attr("readonly", true);
				}
			});
			oComboBox2.addEventDelegate({
				onAfterRendering: function () {
					oComboBox2.$().find("input").attr("readonly", true);
				}
			});
			// this.tableData();
			this.onSearch();

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

		comboData: function () {
			var that = this;
			var sUrl = "/destination/Outsystem_Destinations/OutSystem-web/murphy/glAccountWiki/getDropDownValues";
			// var sUrl = "/destination/murphy_Outsystems_Dest/OutSystem-web/murphy/glAccountWiki/fetchDropDownValues";

			this.doAjax(sUrl, "GET", null, function (data) {
				that.getOwnerComponent().getModel("glAccountModel").setProperty("/combodata", data);
			}.bind(this), function (oError) {
				// var sErrorMessage;
				// sErrorMessage = oError.getParameter("statusText");
				// this._createConfirmationMessage("Error", sErrorMessage, "Error", "", "Close", false, null);
			}.bind(this));
		},

		// mulesoftServiceCall: function (oEvent) {
		// 	var that = this;
		// 	var sUrl = "/destination/murphy_Outsystem_MuleSoft_API/hana-sys/1.0/GLAccounts";
		// 	// var sUrl = "http://mochana-sys-dev.cloudhub.io/hana-sys/1.0/GLAccounts";
		// 	var oModel = new JSONModel();
		// 	// sURL, oParameters?, bAsync?, sType?, bMerge?, bCache?, mHeaders?
		// 	var oHeaders = {
		// 		"client_id": "test",
		// 		"client_secret": "test",
		// 		"Cache-Control": "no-cache"
		// 	};

		// 	oModel.loadData(sUrl, null, true, "GET", null, true, oHeaders);
		// 	oModel.attachRequestCompleted(function (oEvent) {
		// 		if (oEvent.getParameter("success")) {
		// 			var resultData = oEvent.getSource().getData();
		// 		} else {
		// 			MessageToast.show("Error in Retrieving Lookup Values");
		// 		}
		// 	});
		// 	oModel.attachRequestFailed(function (oEvent) {
		// 		MessageToast.show("Error in Retrieving Lookup Values");
		// 	});
		// },

		tableData: function () {
			var a = new sap.m.BusyDialog();
			// a.open();
			// this.mulesoftServiceCall();
			var that = this;
			var oData = this.getOwnerComponent().getModel("glAccountModel").getData();
			var acntStatus = oData.statusActiveChange;
			var oPage = Number(oData.pageCount);
			var topCount = oPage * 100;
			var start = topCount - 100;
			that.getOwnerComponent().getModel("glAccountModel").setProperty("/start", start);
			that.getOwnerComponent().getModel("glAccountModel").setProperty("/end", topCount);

			var balanceType = oData.isorbsValue;
			var accountGroup = oData.AccClass;

			if (oPage === 1) {
				var skipCount = 1;
			} else {
				var skipCount = this.getOwnerComponent().getModel("glAccountModel").getData().pageCount;
				// var skipCount = topCount - 100;
				var skipCount = 0;
			}
			// var sUrl =
			// 	"/destination/Outsystem_Destinations/OutSystem-web/murphy/glAccountWiki/fetchAllGLAccountDetails?skipCount=" +
			// 	skipCount + "&topCount=100";

			var sUrl = "/destination/Outsystem_Destinations/OutSystem-web/murphy/glAccountWiki/fetchAllGLAccountDetails";

			var oData = this.getOwnerComponent().getModel("glAccountModel").getData();

			if (oData.uAccDesc) {
				sUrl += "&accountDesc=" + oData.uAccDesc;
			}
			if (oData.uAccName) {
				sUrl += "&accountName=" + oData.uAccName;
			}
			if (oData.uRollUp) {
				sUrl += "&accountRollup=" + oData.uRollUp;
			}
			if (oData.uGlAccount) {
				sUrl += "&glAccount=" + oData.uGlAccount;
			}
			if (oData.isorbsValue) {
				sUrl += "&glacntType=" + oData.isorbsValue;
			}
			if (oData.statusActiveChange) {
				sUrl += "&acntStatus=" + oData.statusActiveChange;
			}
			if (oData.AccClass) {
				sUrl += "&accountClsf=" + oData.AccClass;
			}

			// if (!this.getOwnerComponent().getModel("glAccountModel").getData().AccDesc) {

			this.doAjax(sUrl, "GET", null, function (data) {
					a.close();
					debugger;
					that.getOwnerComponent().getModel("glAccountModel").setProperty("/data", data);
					var tableValues = that.getOwnerComponent().getModel("glAccountModel").getData().data.glAccountsDtoList;

					var totalRecords = that.getOwnerComponent().getModel("glAccountModel").getData().data.totalRecords;
					that.getOwnerComponent().getModel("glAccountModel").setProperty("/totalRecords", totalRecords);
					that.getOwnerComponent().getModel("glAccountModel").setProperty("/pageSize", pageSize);
					var skipCount = that.getOwnerComponent().getModel("glAccountModel").getData().data.pageSize;
					var topCount = Number(that.getOwnerComponent().getModel("glAccountModel").getData().pageCount) * 2;
					if (skipCount + topCount < totalRecords) {
						that.getOwnerComponent().getModel("glAccountModel").setProperty("/nextButtonVisible", true);
					} else if (skipCount + topCount > totalRecords) {
						that.getOwnerComponent().getModel("glAccountModel").setProperty("/previousButtonVisible", true);
						that.getOwnerComponent().getModel("glAccountModel").setProperty("/nextButtonVisible", false);
					}
					if (topCount - skipCount > skipCount) {
						that.getOwnerComponent().getModel("glAccountModel").setProperty("/nextButtonVisible", false);
					} else {
						that.getOwnerComponent().getModel("glAccountModel").setProperty("/nextButtonVisible", true);
					}

					// here total records are 2 per page
					var pageSize = data.pageSize;
					var totalRecords = data.totalRecords;
					if (pageSize * 100 >= totalRecords) {
						that.getOwnerComponent().getModel("glAccountModel").setProperty("/nextButtonVisible", false);
						that.getOwnerComponent().getModel("glAccountModel").setProperty("/previousButtonVisible", true);
					}

					var end = that.getOwnerComponent().getModel("glAccountModel").getData().end;

					if (end > totalRecords) {
						that.getOwnerComponent().getModel("glAccountModel").setProperty("/end", totalRecords);
					}

					that.getOwnerComponent().getModel("glAccountModel").setProperty("/filtersApplied", "");
					this.onSearch();
				}.bind(this),
				function (oError) {
					// this._createConfirmationMessage("Error", oError.statusText, "Error", "", "Close", false, null);
				}.bind(this));

			// $.ajax({
			// 	url: sUrl,
			// 	type: "POST",
			// 	// headers: {
			// 	// 	"client_id": "test",
			// 	// 	"client_secret": "test",
			// 	// 	"Cache-Control": "no-cache"
			// 	// },
			// 	cache: true,
			// 	data: JSON.stringify(oPayload),
			// 	// beforeSend: function (request) {
			// 	// 	request.setRequestHeader("client_id", "test");
			// 	// 	request.setRequestHeader("client_secret", "test");
			// 	// 	request.setRequestHeader("Cache-Control", "no-cache");
			// 	// },
			// 	contentType: "application/json",
			// 	success: function (data) {
			// 		that.getOwnerComponent().getModel("glAccountModel").setProperty("/data", data);
			// 		var totalRecords = that.getOwnerComponent().getModel("glAccountModel").getData().data.totalRecords;
			// 		that.getOwnerComponent().getModel("glAccountModel").setProperty("/totalRecords", totalRecords);
			// 		// var skipCount = that.getOwnerComponent().getModel("glAccountModel").getData().data.pageSize;
			// 		var topCount = Number(that.getOwnerComponent().getModel("glAccountModel").getData().pageCount) * 2;
			// 		if (skipCount + topCount < totalRecords) {
			// 			that.getOwnerComponent().getModel("glAccountModel").setProperty("/nextButtonVisible", true);
			// 		} else if (skipCount + topCount > totalRecords) {
			// 			that.getOwnerComponent().getModel("glAccountModel").setProperty("/previousButtonVisible", true);
			// 			that.getOwnerComponent().getModel("glAccountModel").setProperty("/nextButtonVisible", false);
			// 		}

			// 		if (topCount - skipCount > skipCount) {
			// 			that.getOwnerComponent().getModel("glAccountModel").setProperty("/nextButtonVisible", false);
			// 		} else {
			// 			that.getOwnerComponent().getModel("glAccountModel").setProperty("/nextButtonVisible", true);
			// 		}
			// 		// that.getOwnerComponent().getModel("glAccountModel").setProperty("/filtersApplied", "");

			// 	},
			// 	error: function (e) {
			// 		MessageToast.show(e.statusText);
			// 	}
			// });

		},

		// onPressGo: function (oEvent) {

		// 	var AccountDesc = this.getOwnerComponent().getModel("glAccountModel").getData().AccDesc;
		// 	var AccName = this.getOwnerComponent().getModel("glAccountModel").getData().AccName;
		// 	var AccRoll = this.getOwnerComponent().getModel("glAccountModel").getData().AccRoll;
		// 	var gl = this.getOwnerComponent().getModel("glAccountModel").getData().gl;
		// 	var ISorBS = this.getOwnerComponent().getModel("glAccountModel").getData().isorbsValue;
		// 	var AccountClassfication = this.getOwnerComponent().getModel("glAccountModel").getData().AccClass;

		// 	if (AccountDesc) {
		// 		var filtersApplied = Number(this.getOwnerComponent().getModel("glAccountModel").getData().filtersApplied) + 1;
		// 		this.getOwnerComponent().getModel("glAccountModel").setProperty("/filtersApplied", filtersApplied);
		// 	}
		// 	if (AccName) {
		// 		var filtersApplied = Number(this.getOwnerComponent().getModel("glAccountModel").getData().filtersApplied) + 1;
		// 		this.getOwnerComponent().getModel("glAccountModel").setProperty("/filtersApplied", filtersApplied);
		// 	}
		// 	if (AccRoll) {
		// 		var filtersApplied = Number(this.getOwnerComponent().getModel("glAccountModel").getData().filtersApplied) + 1;
		// 		this.getOwnerComponent().getModel("glAccountModel").setProperty("/filtersApplied", filtersApplied);
		// 	}
		// 	if (gl) {
		// 		var filtersApplied = Number(this.getOwnerComponent().getModel("glAccountModel").getData().filtersApplied) + 1;
		// 		this.getOwnerComponent().getModel("glAccountModel").setProperty("/filtersApplied", filtersApplied);
		// 	}
		// 	if (ISorBS) {
		// 		var filtersApplied = Number(this.getOwnerComponent().getModel("glAccountModel").getData().filtersApplied) + 1;
		// 		this.getOwnerComponent().getModel("glAccountModel").setProperty("/filtersApplied", filtersApplied);
		// 	}
		// 	if (AccountClassfication) {
		// 		var filtersApplied = Number(this.getOwnerComponent().getModel("glAccountModel").getData().filtersApplied) + 1;
		// 		this.getOwnerComponent().getModel("glAccountModel").setProperty("/filtersApplied", filtersApplied);
		// 	}
		// 	this.tableData();

		// 	// if(AccountDesc || ){

		// 	// }

		// 	// var olist = this.getView().byId("glTableId"),
		// 	// 	arr = [],
		// 	// 	binding,
		// 	// 	filters;
		// 	// if (AccountDesc || AccName || AccRoll || gl || ISorBS || AccountClassfication) {
		// 	// 	this._oGlobalFilter = new Filter([
		// 	// 		new Filter("accountDesc", FilterOperator.Contains, AccountDesc),
		// 	// 		new Filter("accountName", FilterOperator.Contains, AccName),
		// 	// 		new Filter("accountRollup", FilterOperator.Contains, AccRoll),
		// 	// 		new Filter("glAccount", FilterOperator.EQ, gl),
		// 	// 		new Filter("balanceType", FilterOperator.Contains, ISorBS),
		// 	// 		new Filter("accountGroup", FilterOperator.Contains, AccountClassfication)

		// 	// 	], false);
		// 	// }
		// 	// this._filter();

		// },

		// _filter: function () {
		// 	var oFilter = null;
		// 	if (this._oGlobalFilter) {
		// 		oFilter = new sap.ui.model.Filter(this._oGlobalFilter, true);
		// 	} else if (this._oGlobalFilter) {
		// 		oFilter = this._oGlobalFilter;
		// 	}

		// 	this.byId("glTableId").getBinding("items").filter(oFilter);
		// 	this.getOwnerComponent().getModel("glAccountModel").setProperty("/isorbsValue", "");
		// 	this.getOwnerComponent().getModel("glAccountModel").setProperty("/AccClass", "");
		// },

		// updatePagination: function (opageCount, oTotalCount) {
		// 	if (oTotalCount > 0) {
		// 		// glAccountModel.setProperty("/locationHistoryData/locHistoryPaginationVisibility", true);
		// 		var oStartIndex = (opageCount - 1) * 2 + 1;
		// 		var oEndIndex = oStartIndex + 1;
		// 		if (oEndIndex > oTotalCount) {
		// 			oEndIndex = oTotalCount;
		// 		}
		// 		if (oStartIndex > 100) {
		// 			this.getOwnerComponent().getModel("glAccountModel").setProperty("/previousButtonVisible", false);
		// 			// glAccountModel.setProperty("/locationHistoryPagination/LocHistoryPreviousButtonEnable", true);
		// 		} else {
		// 			this.getOwnerComponent().getModel("glAccountModel").setProperty("/previousButtonVisible", true);
		// 			// glAccountModel.setProperty("/locationHistoryPagination/LocHistoryPreviousButtonEnable", false);
		// 		}
		// 		if (oEndIndex < oTotalCount) {
		// 			this.getOwnerComponent().getModel("glAccountModel").setProperty("/nextButtonVisible", false);
		// 			// glAccountModel.setProperty("/locationHistoryPagination/LocHistoryNextButtonEnable", true);
		// 		} else {
		// 			this.getOwnerComponent().getModel("glAccountModel").setProperty("/nextButtonVisible", true);
		// 			// glAccountModel.setProperty("/locationHistoryPagination/LocHistoryNextButtonEnable", false);
		// 		}
		// 		// var sText = oStartIndex + "- " + oEndIndex + " of " + oTotalCount;
		// 		// glAccountModel.setProperty("/locationHistoryPagination/PaginationText", sText);
		// 		// } else {
		// 		// 	// glAccountModel.setProperty("/locationHistoryData/locHistoryPaginationVisibility", false);
		// 	}
		// },

		// onScrollLeftPage: function () {
		// 	var that = this;
		// 	var pageCount = Number(this.getOwnerComponent().getModel("glAccountModel").getData().pageCount);
		// 	var totalRecords = Number(that.getOwnerComponent().getModel("glAccountModel").getData().data.totalRecords);

		// 	if (pageCount > 1) {
		// 		pageCount = pageCount - 1;
		// 		this.getOwnerComponent().getModel("glAccountModel").setProperty("/pageCount", pageCount);
		// 		this.tableData();
		// 	}
		// 	if (pageCount === 1) {
		// 		this.getOwnerComponent().getModel("glAccountModel").setProperty("/previousButtonVisible", false);
		// 		this.tableData();
		// 	} else {
		// 		this.getOwnerComponent().getModel("glAccountModel").setProperty("/nextButtonVisible", true);
		// 	}

		// 	var sTotalResord = that.getOwnerComponent().getModel("glAccountModel").getData().totalRecords;
		// 	// this.updatePagination(pageCount, sTotalResord);

		// },

		// onScrollRightPage: function () {
		// 	var that = this;
		// 	var pageCount = Number(this.getOwnerComponent().getModel("glAccountModel").getData().pageCount);
		// 	var pageCount = pageCount + 1;
		// 	this.getOwnerComponent().getModel("glAccountModel").setProperty("/pageCount", pageCount);

		// 	if (pageCount > 1) {
		// 		this.getOwnerComponent().getModel("glAccountModel").setProperty("/previousButtonVisible", true);

		// 		this.tableData();
		// 	} else if (pageCount === 1) {
		// 		this.getOwnerComponent().getModel("glAccountModel").setProperty("/previousButtonVisible", false);
		// 		this.tableData();
		// 	} else {
		// 		this.getOwnerComponent().getModel("glAccountModel").setProperty("/nextButtonVisible", true);
		// 	}
		// 	var sTotalResord = that.getOwnerComponent().getModel("glAccountModel").getData().totalRecords;

		// 	var end = that.getOwnerComponent().getModel("glAccountModel").getData().end;

		// 	if (end > sTotalResord) {
		// 		that.getOwnerComponent().getModel("glAccountModel").setProperty("/end", sTotalResord);
		// 	}

		// 	// this.updatePagination(pageCount, sTotalResord);
		// },
		onPressExport: function () {
			debugger;

			// var IS = this.getView().getModel("glAccountModel").getData().balanceType;
			// var ACC_CLASS = this.getView().getModel("glAccountModel").getData().accountGroup;
			// var ACC_ROLL = this.getView().getModel("glAccountModel").getProperty("/AccRoll");
			// var GL = this.getView().getModel("glAccountModel").getProperty("/gl");
			// var ACC_NAME = this.getView().getModel("glAccountModel").getProperty("/AccName");
			// var ACC_DESC = this.getView().getModel("glAccountModel").getProperty("/AccDesc");
			// var status = this.getView().getModel("glAccountModel").getData().statusActive;

			var oExportModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oExportModel, "oExportModel");
			var oTable = this.getView().byId("glTableId");
			// var oAllItems = oTable.getItems();
			// this.getOwnerComponent().getModel("glAccountModel").setProperty("/indicesValues", []);
			var oAllItems = this.getOwnerComponent().getModel("glAccountModel").getData().indicesValues;
			var oTableArray = [];
			// for (var i = 0; i < oAllItems.length; i++) {
			// 	// var oRowData = oAllItems[i].getBindingContext("glAccountModel").getObject();
			// 	// oTableArray.push(oRowData);
			// 	oTableArray.push(oAllItems);

			// }

			// if(IS === "All" && ACC_CLASS === "All" && ACC_ROLL === "" && GL === "" && ACC_NAME === "" && ACC_DESC === "" && status == "All" ){
			// 	oExportModel.setData({
			// 		"results": this.getOwnerComponent().getModel("glAccountModel").getData().data.glAccountsDtoList
			// 	});
			// }

			if (oAllItems.length === 0) {
				oExportModel.setData({
					"results": this.getOwnerComponent().getModel("glAccountModel").getData().data.glAccountsDtoList
				});

			} else {
				oExportModel.setData({
					"results": oAllItems
				});
			}

			oExportModel.refresh(true);

			/*export as xls*/
			var aCols = [];
			aCols = [{
				label: 'I/S or BS',
				property: 'balanceSheetAccount',
				type: 'string'
			}, {
				label: 'Account Classification',
				property: 'glAccountGroup',
				type: 'string'
			}, {
				label: 'Account Rollup',
				property: 'tdID0001',
				type: 'string'
			}, {
				label: 'GL Account',
				property: 'accountNumber',
				type: 'string'
			}, {
				label: 'Account Name',
				property: 'accountDesc',
				type: 'string'
			}, {
				label: 'Account Description',
				property: 'tdID0002',
				type: 'string'
			}];

			var date = new Date();
			var hour = new Date(date).getUTCHours();
			var Minuts = new Date(date).getUTCMinutes();
			var seconds = new Date(date).getUTCSeconds();

			var oFileName = "GL_Account_Wiki_Report" + hour + ":" + Minuts + ":" + seconds;

			var oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: oExportModel.getData().results,
				worker: false,
				fileName: oFileName,
				showProgress: false
			};

			new Spreadsheet(oSettings).build();

			// var sUrl = "/destination/murphy_Outsystems_Dest/OutSystem-web/murphy/glAccountWiki/exportDatatoExcel";
			// // var accountStatus = this.getOwnerComponent().getModel("glAccountModel").setProperty("/statusActive", statusText);
			// var accountStatus = this.getOwnerComponent().getModel("glAccountModel").getData().statusActive;
			// var AccountClassfication = this.getOwnerComponent().getModel("glAccountModel").getData().AccClass;
			// var accountNumber = this.getOwnerComponent().getModel("glAccountModel").getData().gl;
			// var balanceType = this.getOwnerComponent().getModel("glAccountModel").getData().isorbsValue;
			// var glAccountRollUp = this.getOwnerComponent().getModel("glAccountModel").getData().AccRoll;
			// var accountName = this.getOwnerComponent().getModel("glAccountModel").getData().AccName;
			// var accountDesc = this.getOwnerComponent().getModel("glAccountModel").getData().uAccDesc;
			// var glAccountNum = this.getOwnerComponent().getModel("glAccountModel").getData().uGlAccount;

			// var oPayload = {
			// 	"fileFormate": "Excel",
			// 	"reportName": "GL_Accounts_Wiki",
			// 	"accountStatus": accountStatus,
			// 	"accountType": accountDesc,
			// 	"accountClassf": AccountClassfication,
			// 	"glAccountNum": glAccountNum,
			// 	"glAccountRollUp": glAccountRollUp,
			// 	"accountName": accountName,
			// 	"accountDesc": accountDesc
			// };

			// $.ajax({
			// 	url: sUrl,
			// 	type: "POST",
			// 	processData: false,
			// 	async: false,
			// 	data: JSON.stringify(oPayload),
			// 	contentType: "application/json",
			// 	success: function (data) {

			// 		var Base64 = data.base64;
			// 		var filename = data.filename;
			// 		var fileType = ".xlsx";

			// 		var u8_2 = new Uint8Array(atob(Base64).split("").map(function (c) {
			// 			return c.charCodeAt(0);
			// 		}));
			// 		var blob = new Blob([u8_2], {
			// 			type: fileType
			// 		});
			// 		if (window.navigator.msSaveOrOpenBlob) {
			// 			window.navigator.msSaveOrOpenBlob(blob, filename);
			// 		} else {
			// 			var a = document.createElement("a");
			// 			a.setAttribute("style", "display: none");
			// 			setTimeout(function () {
			// 				document.body.appendChild(a);
			// 				try {
			// 					var url = window.URL.createObjectURL(blob);
			// 					a.href = url;
			// 					a.download = filename;
			// 					a.click();
			// 					window.URL.revokeObjectURL(url);
			// 				} catch (e) {}
			// 			}, 100);
			// 		}
			// 	},
			// 	error: function (e) {
			// 		MessageToast.show(e.statusText);
			// 	}
			// });
		},

		onSelectionChangeIS: function (oEvent) {

			var ISorBS = oEvent.getSource().getSelectedItem().getText();
			if (ISorBS === "All") {
				this.getOwnerComponent().getModel("glAccountModel").setProperty("/isorbsValue", "");
			} else {
				this.getOwnerComponent().getModel("glAccountModel").setProperty("/isorbsValue", ISorBS);
			}
			var ISorBS = this.getOwnerComponent().getModel("glAccountModel").getData().isorbsValue;

			var olist = this.getView().byId("glTableId"),
				arr = [],
				binding,
				filters;
			filters = new Filter({
				filters: [new Filter("balanceSheetAccount", FilterOperator.Contains, oEvent.getSource().getValue())],
				and: false
			});

			//  var empId = new Filter("number", FilterOperator.Contains,event.getSource().getValue());
			binding = olist.getBinding("items");
			arr.push(filters);
			// arr.push(empId);
			binding.filter(arr);

			// this.tableData();

			// var filtersApplied = this.getOwnerComponent().getModel("glAccountModel").getData().filtersApplied + 1;
			// this.getOwnerComponent().getModel("glAccountModel").setProperty("/filtersApplied", filtersApplied);
		},
		onSelectionChangeAcc_Class: function (oEvent) {

			var AccClass = oEvent.getSource().getSelectedItem().getText();
			if (AccClass === "All") {
				this.getOwnerComponent().getModel("glAccountModel").setProperty("/AccClass", "");
			} else {
				this.getOwnerComponent().getModel("glAccountModel").setProperty("/AccClass", AccClass);
			}
			var AccountClassfication = this.getOwnerComponent().getModel("glAccountModel").getData().AccClass;

			this.tableData();
			// var filtersApplied = this.getOwnerComponent().getModel("glAccountModel").getData().filtersApplied + 1;
			// this.getOwnerComponent().getModel("glAccountModel").setProperty("/filtersApplied", filtersApplied);
		},
		onSelectionState: function (oEvent) {

			var statusText = oEvent.getSource().getSelectedItem().getText();

			this.getOwnerComponent().getModel("glAccountModel").setProperty("/pageCount", "1");

			this.getOwnerComponent().getModel("glAccountModel").setProperty("/statusActive", statusText);

			this.onSearch();
		},

		onSearch: function (oEvent) {
			debugger;
			// this.tableData();
			var IS = this.getView().getModel("glAccountModel").getData().balanceType;
			var ACC_CLASS = this.getView().getModel("glAccountModel").getData().accountGroup;
			var ACC_ROLL = this.getView().getModel("glAccountModel").getProperty("/AccRoll");
			var GL = this.getView().getModel("glAccountModel").getProperty("/gl");
			var ACC_NAME = this.getView().getModel("glAccountModel").getProperty("/AccName");
			var ACC_DESC = this.getView().getModel("glAccountModel").getProperty("/AccDesc");
			var status = this.getView().getModel("glAccountModel").getData().statusActive;

			var oTable = this.getView().byId("glTableId");

			var filterParams = ["balanceSheetAccount", "glAccountGroup", "tdID0001", "accountNumber", "accountDesc", "tdID0002",
				"blockPostingIndicator"
			];
			var aFilters;
			var filterArray = [];
			/*if (IS) {
				filterArray.push(new sap.ui.model.Filter(filterParams[0], sap.ui.model.FilterOperator.Contains, IS));
			}
			if (ACC_CLASS) {
				filterArray.push(new sap.ui.model.Filter(filterParams[1], sap.ui.model.FilterOperator.Contains, ACC_CLASS));
			}*/
			if (ACC_ROLL) {
				this.getOwnerComponent().getModel("glAccountModel").setProperty("/indicesValues", []);
				filterArray.push(new sap.ui.model.Filter(filterParams[2], sap.ui.model.FilterOperator.Contains, ACC_ROLL));
			}
			if (GL) {
				this.getOwnerComponent().getModel("glAccountModel").setProperty("/indicesValues", []);
				filterArray.push(new sap.ui.model.Filter(filterParams[3], sap.ui.model.FilterOperator.Contains, GL));
			}
			if (ACC_NAME) {
				this.getOwnerComponent().getModel("glAccountModel").setProperty("/indicesValues", []);
				filterArray.push(new sap.ui.model.Filter(filterParams[4], sap.ui.model.FilterOperator.Contains, ACC_NAME));
			}
			if (ACC_DESC) {
				this.getOwnerComponent().getModel("glAccountModel").setProperty("/indicesValues", []);
				filterArray.push(new sap.ui.model.Filter(filterParams[5], sap.ui.model.FilterOperator.Contains, ACC_DESC));
			}
			/*	if (status) {
				filterArray.push(new sap.ui.model.Filter(filterParams[6], sap.ui.model.FilterOperator.Contains, blockPostingIndicator));
			}*/

			if (IS && IS !== "All") {
				this.getOwnerComponent().getModel("glAccountModel").setProperty("/indicesValues", []);
				filterArray.push(new sap.ui.model.Filter(filterParams[0], sap.ui.model.FilterOperator.Contains, IS));
			}
			if (ACC_CLASS && ACC_CLASS !== "All") {
				this.getOwnerComponent().getModel("glAccountModel").setProperty("/indicesValues", []);
				filterArray.push(new sap.ui.model.Filter(filterParams[1], sap.ui.model.FilterOperator.Contains, ACC_CLASS));
			}
			if (status && status !== "All") {
				this.getOwnerComponent().getModel("glAccountModel").setProperty("/indicesValues", []);
				filterArray.push(new sap.ui.model.Filter(filterParams[6], sap.ui.model.FilterOperator.EQ, status));
			}

			aFilters = new sap.ui.model.Filter({
				filters: filterArray,
				and: true
			});
			oTable.getBinding("items").filter(aFilters);

			var oFilteredRecords = this.getView().byId("glTableId").getBinding("items").filter(aFilters);
			var oFilteredRecordsIndices = oFilteredRecords.aIndices;
			// var oTotalRecords = this.getOwnerComponent().getModel("glAccountModel").getData().data.glAccountsDtoList;

			debugger;
			if (oFilteredRecords.aIndices.length !== 0) {
				for (var i = 0; i <= oFilteredRecordsIndices.length; i++) {
					// oFilteredRecordsIndices[i];

					// this.getOwnerComponent().getModel("glAccountModel").setProperty("/indicesValues", []);
					var indexValue = oFilteredRecordsIndices[i];
					this.getOwnerComponent().getModel("glAccountModel").getData().indicesValues.push(
						this.getOwnerComponent().getModel("glAccountModel").getData().data.glAccountsDtoList[indexValue]);
				}
			}

			// for(var i=0; i<=oTotalRecords.length; i++){
			// 	oTotalRecords[i]
			// 	var downRecords = this.getOwnerComponent().getModel("glAccountModel").getData().downRecords;
			// }

			// var oTotalRecordsIndices = oTotalRecords;

			// if(oFilteredRecordsIndices === oTotalRecordsIndices){
			// 	var downRecords = this.getOwnerComponent().getModel("glAccountModel").getData().downRecords;
			// 	debugger;
			// 	downRecords.push();
			// }

		},

		onPressAccRollUp: function (oEvent) {

			var accountRollup = oEvent.getParameters().value;
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/uRollUp", accountRollup);

			debugger;

			var oTable = this.getView().byId("glTableId");
			var aFilters;
			var filterArray = [];
			if (accountRollup) {
				filterArray.push(new sap.ui.model.Filter("AccRoll", sap.ui.model.FilterOperator.Contains, accountRollup));
			}

			aFilters = new sap.ui.model.Filter({
				filters: filterArray,
				and: true
			});
			oTable.getBinding("items").filter(aFilters);

			// var oTable = this.getView().byId("glTableId"),
			// 	arr = [],
			// 	binding,
			// 	filters;
			// filters = new Filter({
			// 	filters: [new sap.ui.model.Filter("AccRoll", sap.ui.model.FilterOperator.Contains,accountRollup )],
			// 	and: false
			// });

			// arr.push(filters);
			// binding = oTable.getBinding("items");
			// binding.Filter(arr);

			// this.tableData();

		},
		onPressGlAccount: function (oEvent) {
			var accountClsf = oEvent.getParameters().value;
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/uGlAccount", accountClsf);
			debugger;
			var oTable = this.getView().byId("glTableId");
			// var filterParams = ["requestID", "subject", "requestingUser", "status"];
			var aFilters;
			var filterArray = [];
			if (accountClsf) {
				filterArray.push(new sap.ui.model.Filter("gl", sap.ui.model.FilterOperator.Contains, accountClsf));
			}

			aFilters = new sap.ui.model.Filter({
				filters: filterArray,
				and: true
			});
			oTable.getBinding("items").filter(aFilters);

			// this.tableData();
		},
		onPressAccName: function (oEvent) {
			var accountName = oEvent.getParameters().value;
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/uAccName", accountName);
			var oTable = this.getView().byId("glTableId");
			var aFilters;
			var filterArray = [];
			if (accountName) {
				filterArray.push(new sap.ui.model.Filter("AccName", sap.ui.model.FilterOperator.Contains, accountName));
			}

			aFilters = new sap.ui.model.Filter({
				filters: filterArray,
				and: true
			});
			oTable.getBinding("items").filter(aFilters);

			// this.tableData();
		},
		onPressAccDesc: function (oEvent) {
			var accountDesc = oEvent.getParameters().value;
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/uAccDesc", accountDesc);
			var oTable = this.getView().byId("glTableId");
			var aFilters;
			var filterArray = [];
			if (accountDesc) {
				filterArray.push(new sap.ui.model.Filter("AccDesc", sap.ui.model.FilterOperator.Contains, accountDesc));
			}

			aFilters = new sap.ui.model.Filter({
				filters: filterArray,
				and: true
			});
			oTable.getBinding("items").filter(aFilters);
			// this.tableData();
		},

		onPressClear: function () {
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/balanceType", "");
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/accountGroup", "");
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/AccRoll", "");
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/gl", "");
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/AccName", "");
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/AccDesc", "");
			// var filtersApplied = this.getOwnerComponent().getModel("glAccountModel").getData().filtersApplied + 1;
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/filtersApplied", "");
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/uRollUp", "");
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/uGlAccount", "");
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/uAccName", "");
			this.getOwnerComponent().getModel("glAccountModel").setProperty("/uAccDesc", "");
			this.tableData();

			// this.getOwnerComponent().getModel("data").setProperty("/year", "");
			// this.getOwnerComponent().getModel("data").setProperty("/month", "");

		},

		// });

	});

});