/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device"],function(t){"use strict";var e={};e.render=function(t,e){t.write("<div ");t.writeControlData(e);t.addClass("sapTntBoxContainer");t.writeClasses();t.addStyle("width",e.getWidth());t.writeStyles();t.write(">");t.renderControl(e.getAggregation("_list"));t.write("</div>")};return e},true);