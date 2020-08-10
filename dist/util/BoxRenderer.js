/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/CustomListItemRenderer","sap/ui/core/Renderer","sap/ui/Device"],function(e,t,i){"use strict";var r=t.extend(e);r.renderLIAttributes=function(t,i){e.renderLIAttributes(t,i);t.addClass("sapTntBox");this.renderWidthStyle(t,i)};r.renderWidthStyle=function(e,t){var r=t.getList(),n;if(!i.browser.msie){return}if(r&&r.getMetadata().getName()==="sap.tnt.BoxContainerList"){n=r.getBoxWidth()||r.getBoxMinWidth()}if(n){e.addStyle("width",n)}};return r});