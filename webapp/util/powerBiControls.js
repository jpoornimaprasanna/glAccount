jQuery.sap.declare("compRT_App.Combined.Light.util.powerBiControls");

compRT_App.Combined.Light.util.powerBiControls = {
	takeScreenShot: function () {
		html2canvas(document.getElementById("powerBiPop--powerBiDialog-cont"), {
			onrendered: function (canvas) {
				var tempcanvas = document.createElement('canvas');
				tempcanvas.width = 450;
				tempcanvas.height = 450;
				var context = tempcanvas.getContext('2d');
				context.drawImage(canvas, 0, 0, 1440, 638, 0, 0, 1440, 638);
				var link = document.createElement("a");
				link.href = tempcanvas.toDataURL("image/jpg"); //function blocks CORS
				link.download = "screenshot.jpg";
				link.click();
			}
		});
	},
	embedReport: function (reportData, muwiId, type, taskMode, container, ref, tabName) {
		this.embedReportAndSetTokenListener(reportData, muwiId, type, taskMode, container, ref, tabName);
	},

	fullscreen: function () {
		var element = $("#embedContainer")[0];
		var report = powerbi.get(element);
		report.fullscreen();
	},

	createConfig: function (embedToken, reportId, groupId, muwiId, type, taskMode, sTableName) {
		var tableName = sTableName ? sTableName : '';
		var columnName = "MUWI";
		var filterValue = []; //["9264212700000000STB0044H1"]; // = muwiId;
		if (muwiId && sTableName) {
			for (var i = 0; i < muwiId.length; i++)
				filterValue.push(muwiId[i].muwi);
		}
		// if (type === "FRAC") {
		// 	tableName = "Well";
		// }
		var Filter1 = {
			$schema: "http://powerbi.com/product/schema#advanced",
			target: {
				table: tableName,
				column: columnName
			},
			operator: "In",
			values: filterValue
		};

		//	'https://app.powerbi.com/reportEmbed?reportId=bac25fa7-d58d-40b6-8b01-606d165c3b43&groupId=be8908da-da25-452e-b220-163f52476cdd'
		var models = window['powerbi-client'].models;
		var permissions = models.Permissions.All;
		var embedUrl = 'https://app.powerbi.com/reportEmbed?reportId=' + reportId + '&groupId=' + groupId;
		var embedConfiguration = {
			type: 'report',
			id: reportId,
			embedUrl: embedUrl,
			tokenType: models.TokenType.Embed,
			permissions: permissions,
			filters: [Filter1],
			settings: {
				navContentPaneEnabled: false,
				customLayout: {
					pageSize: {
						type: models.PageSizeType.Custom,
						width: 1600,
						height: 1200
					}
				},
				displayOption: models.DisplayOption.ActualSize,
				filterPaneEnabled: false,
				extensions: [{
					command: {
						name: "copy",
						title: "copy",
						icon: "",
						extend: {
							visualContextMenu: {
								title: "Copy Key Value"
							}
						}
					}
				}]
			},
			accessToken: embedToken
		};
		return embedConfiguration;
	},
	embedReportAndSetTokenListener: function (reportData, muwiId, type, taskMode, container, ref, tabName) {
		var that = this;
		var embedContainer = $(container)[0];

		// set config for embedding report
		var reportId = reportData.reportId;
		var groupId = reportData.groupId;
		var embedToken = reportData.accessToken;
		// var sTableName = reportData.tableName;
		var config = this.createConfig(embedToken, reportId, groupId, muwiId, type, taskMode, tabName);

		//  console.log(config);
		// Get a reference to the embedded report HTML element

		// Embed the report and display it within the div container.
		var report = powerbi.embedNew(embedContainer, config);

		// Report.off removes a given event handler if it exists.

		// report.off("loaded");
		// 		var tableName = "getTrends";
		// 		var columnName = "MUWI";
		// 		var filterValue = muwiId;
		// 		if (type === "INVESTIGATION") {
		// 			tableName = "getALS";
		// 			if (taskMode === "7") {
		// 				columnName = "MUWI_X";
		// 				filterValue = muwiId+"-Y";
		// 			}
		// 		}
		// 		else if (type === "VARIENCE") {
		// 			tableName = "DOP";
		// 			columnName = "MUWI_X";
		// 			if (taskMode === "7") {
		// 				filterValue = muwiId+"-Weekly";
		// 			} else {
		// 				filterValue = muwiId+"-Daily";
		// 			}
		// 		}
		// 		// var embedContainer = $('#embedContainer')[0];
		var embdedReport = powerbi.get(embedContainer);

		setInterval(function () {
			embdedReport.refresh();
		}, 16000);
		// 		var Filter1 = {
		// 			$schema: "http://powerbi.com/product/schema#advanced",
		// 			target: {
		// 				table: tableName,
		// 				column: columnName
		// 			},
		// 			operator: "In",
		// 			values: [filterValue]
		// 		};

		// embdedReport.setFilters([filter]).catch(function (errors) {
		// 	Log.log(errors);
		// });

		// report.on("loaded", function() {
		// 	$("#embedContainer").height("30em");  
		// 	$("#embedContainer").width("80em");  
		// });

		// report.on('loaded', event => {
		// 	$("#embedContainer").height("30em");  
		// 	$("#embedContainer").width("76em");
		// 	report.getFilters().then(filters => {
		//  			filters.push(Filter1); 
		//  			return report.setFilters(filters);
		// 	});
		// });

		report.on('loaded', function () {
			var width = ref.byId((container + "_VBox").replace("#", '')).$()[0].offsetWidth - 2; //"100%"; // sap.ui.Device.resize.width - 40 + "px";
			// var that = ref;
			var vBoxHeight = ref.byId((container + "_VBox").replace("#", '')).$()[0].offsetHeight; //((container + "_VBox").replace("#", ''))
			var height = vBoxHeight - 52 + "px"; //"48vh"; //sap.ui.Device.resize.height - 170 + "px";
			$(container).height(height);
			$(container).width(width);
			// 			report.getFilters().then(function(filters) {
			// 				filters.push(Filter1);
			// 				return report.setFilters(filters);
			// 			});
		}.bind(this));

		// report.on("dataSelected", function(event) {
		// 	var data = event.detail;
		// 	console.log(data);
		// });

	}
};