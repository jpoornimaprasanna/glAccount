/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","compRT_App/Combined/Light/util/BoxContainerList","compRT_App/Combined/Light/util/BoxContainerRenderer"],function(e,t,i){"use strict";var o=e.extend("compRT_App.Combined.Light.util.BoxContainer",{metadata:{properties:{boxMinWidth:{type:"sap.ui.core.CSSSize",defaultValue:""},boxWidth:{type:"sap.ui.core.CSSSize",defaultValue:""},width:{type:"sap.ui.core.CSSSize",defaultValue:""},headerText:{type:"string",group:"Misc",defaultValue:null},growing:{type:"boolean",group:"Behavior",defaultValue:false},growingThreshold:{type:"int",group:"Misc",defaultValue:20},boxesPerRowConfig:{type:"sap.tnt.BoxesPerRowConfig",group:"Behavior",defaultValue:"XL7 L6 M4 S2"}},defaultAggregation:"boxes",aggregations:{boxes:{type:"compRT_App.Combined.Light.util.Box",multiple:true,singularName:"box",bindable:"bindable",forwarding:{getter:"_getList",aggregation:"items",forwardBinding:true}},headerToolbar:{type:"sap.m.Toolbar",multiple:false,forwarding:{getter:"_getList",aggregation:"headerToolbar",forwardBinding:true}},_list:{type:"sap.m.ListBase",multiple:false,visibility:"hidden"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{boxPress:{parameters:{box:{type:"compRT_App.Combined.Light.util.Box"},srcControl:{type:"sap.ui.core.Control"}}},boxSelectionChange:{parameters:{box:{type:"compRT_App.Combined.Light.util.Box"},srcControl:{type:"sap.ui.core.Control"},selected:{type:"string"}}},removeSelections:{},selectAll:{}}}});o.prototype.init=function(){this._getList()};o.prototype.removeSelections=function(){var e;if(this._bIsBeingDestroyed){return null}e=this.getAggregation("_list");if(e){e.removeSelections()}};o.prototype.selectAllBox=function(){var e;if(this._bIsBeingDestroyed){return null}e=this.getAggregation("_list");if(e){e.selectAll()}};o.prototype._getList=function(){var e;if(this._bIsBeingDestroyed){return null}e=this.getAggregation("_list");if(!e){this.setAggregation("_list",new t(this.getId()+"-inner",{itemPress:function(e){this.fireBoxPress({box:e.getParameter("listItem"),srcControl:e.getParameter("srcControl")})}.bind(this),selectionChange:function(e){this.fireBoxSelectionChange({box:e.getParameter("listItem"),srcControl:e.getSource(),selected:e.getParameter("selected")})}.bind(this)}));e=this.getAggregation("_list")}e.setMode("MultiSelect");return e};o.prototype.getItems=function(){var e=this.getAggregation("_list");if(e){return e.getItems()}};o.prototype.getBindingContext=function(){var e=this.getAggregation("_list");if(e){return e.getBinding("items")}};["setHeaderText","getHeaderText","setGrowing","getGrowing","setGrowingThreshold","getGrowingThreshold","setBoxWidth","getBoxWidth","setBoxMinWidth","getBoxMinWidth","setBoxesPerRowConfig","getBoxesPerRowConfig"].forEach(function(e){o.prototype[e]=function(){var t=this.getAggregation("_list");if(t&&t[e]){var i=t[e].apply(t,arguments);return i===t?this:i}}});return o});