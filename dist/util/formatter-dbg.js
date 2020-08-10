jQuery.sap.declare("GlAccountsWiki.GlAccountsWiki.util.formatter");
GlAccountsWiki.GlAccountsWiki.util.formatter = {
	dateFormatter: function (oVal) {
		if (!oVal) {
			return "";
		}
		var oLocDate = new Date(oVal);
		var oMonthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var yyyy = oLocDate.getFullYear().toString();
		var mmm = oMonthArr[oLocDate.getMonth()];
		var dd = oLocDate.getDate();
		if (dd < 10) {
			dd = "0" + dd.toString();
		}
		var dateString = mmm + " " + dd + ", " + yyyy;
		var meridian = "AM";
		var hh = oLocDate.getHours();
		if (hh >= 12) {
			meridian = "PM";
			if (hh > 12) {
				hh = hh - 12;
			}
		}
		if (hh < 10) {
			hh = "0" + hh;
		}
		var mm = oLocDate.getMinutes();
		if (mm < 10) {
			mm = "0" + mm;
		}
		var ss = oLocDate.getSeconds();
		if (ss < 10) {
			ss = "0" + ss;
		}
		var timeString = hh.toString() + ":" + mm.toString() + ":" + ss.toString() + " " + meridian;
		return dateString + " " + timeString;
	}
	
};