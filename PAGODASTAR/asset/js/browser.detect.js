/******************************************************************************************
* 브라우져 체크 함수 추가 
*
* 2015.08.21 
* ciy202
*******************************************************************************************/

var CommonBrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		if(this.check_IE11()=='OK'){
			this.browser='Explorer';
		}else if(this.check_Edge()=='OK'){
			this.browser='Edge';
		}else if(this.check_Chrome_on_iOS()=='OK'){
			this.browser='Chrome';
		}
		
		
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS= this.getOS();
		//this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	getOS: function(){
		var OSName="Unknown OS";
		if (navigator.appVersion.indexOf("Win")!=-1){
			OSName="Windows"
		}
		else if (navigator.appVersion.indexOf("Mac")!=-1) {
			OSName="MacOS"
		}
		else if (navigator.appVersion.indexOf("X11")!=-1) {
			OSName="UNIX"
		}
		else if (navigator.appVersion.indexOf("Linux")!=-1) {
			OSName="Linux"
		}
		return OSName
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	check_IE11: function (){
		if(navigator.appName.charAt(0) == "N") { 
			if(navigator.userAgent.indexOf("Mozilla") != -1) {
				try {
					var trident = navigator.userAgent.match(/Trident\/(\d.\d)/i)[1];
					if (trident != null){
						return "OK";
					}
				}catch(err){
				}
			}
		}
		return "NO";
	},
	check_Edge: function (){
		if(navigator.appName.charAt(0) == "N") { 
			if(navigator.userAgent.indexOf("Mozilla") != -1) {
				try {
					//var trident = navigator.userAgent.match(/Trident\/(\d.\d)/i)[1];
					//if (trident != null){
						//return "OK";
					//}
					if (/Edge\/12./i.test(navigator.userAgent)){
						return "OK";
					}
				}catch(err){
				}
			}
		}
		return "NO";
	},
	check_Chrome_on_iOS: function (){
		if(navigator.appName.charAt(0) == "N") {
			
			if(navigator.userAgent.indexOf("CriOS") != -1) {
				return "OK";
			}
		}
		return "NO";
	},
	
	
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
CommonBrowserDetect.init();