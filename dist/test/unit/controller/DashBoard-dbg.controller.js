/*global QUnit*/

sap.ui.define([
	"GlAccountsWiki/GlAccountsWiki/controller/DashBoard.controller"
], function (Controller) {
	"use strict";

	QUnit.module("DashBoard Controller");

	QUnit.test("I should test the DashBoard controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});