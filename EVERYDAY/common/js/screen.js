var Browser = {
	isIE : navigator.userAgent.toLowerCase().indexOf("msie")!=-1,
	isIE_6 : navigator.userAgent.toLowerCase().indexOf("msie 6")!=-1,
	isIE_7 : navigator.userAgent.toLowerCase().indexOf("msie 7")!=-1,
	isIE_8 : navigator.userAgent.toLowerCase().indexOf("msie 8")!=-1,
	isFirefox : navigator.userAgent.toLowerCase().indexOf("firefox")!=-1,
	isSafari : navigator.userAgent.toLowerCase().indexOf("safari")!=-1 && navigator.userAgent.toLowerCase().indexOf("chrome")==-1,
	isOpera : navigator.userAgent.toLowerCase().indexOf("opera")!=-1,
	isChrome : navigator.userAgent.toLowerCase().indexOf("safari")!=-1 && navigator.userAgent.toLowerCase().indexOf("chrome")!=-1,
	isNetscape : navigator.userAgent.toLowerCase().indexOf("netscape")!=-1,
	isEtc : navigator.userAgent.toLowerCase().indexOf("gecko")!=-1 && navigator.userAgent.toLowerCase().indexOf("firefox")==-1 && navigator.userAgent.toLowerCase().indexOf("netscape")==-1
};

function getId(id){
	return document.getElementById(id);
}

function obj_checker(obj){
	if (!obj.tagName){ 
		if (getId(obj)){ 
			obj = getId(obj);
		} else {
			return false;
		}
	}
	return obj;
}

function getTagName(name,obj){
	if (!obj){
		if (name == "body"){
			obj = document;
		} else {
			obj = document.body;
		}
	} else {
		obj = obj_checker(obj);
	}
	return obj.getElementsByTagName(name);
}

function bodyBrowserType_Set(){
	var bodyObj = getTagName('body')[0];

	var browtype;
	if (Browser.isIE){
		if (Browser.isIE_6){ browtype = "ie_6"; }
		else if (Browser.isIE_7){ browtype = "ie_7"; }
		else if (Browser.isIE_8){ browtype = "ie_8"; }
		else {browtype = "ie";}
	} else if (Browser.isFirefox){ browtype = "firefox"; 
	} else if (Browser.isSafari){ browtype = "safari"; 
	} else if (Browser.isOpera){ browtype = "opera"; 
	} else if (Browser.isChrome){ browtype = "chrome"; 
	} else if (Browser.isNetscape){ browtype = "netscape"; 
	} else if (Browser.isEtc){ browtype = "etc"; }
	bodyObj.className = browtype;
}

addLoadEvent(function(){
	// common
	bodyBrowserType_Set();
})

// addLoadEvent
function addLoadEvent(func) {
	var oldload = window.onload;
	if(typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			oldload();
			func();
		}
	}
}



/*
 * @title : img on
 * @version : 1.0
 * @what's new :
 */
function menuOn(imgEl)
{
  if(imgEl.src.indexOf("_on") < 0) imgEl.src = imgEl.src.replace(".gif", "_on.gif");
}

/*
 * @title : img off
 * @version : 1.0
 * @what's new :
 */
function menuOut(imgEl)
{
  imgEl.src = imgEl.src.replace("_on.gif", ".gif");
}





/*
 * @title : tapMenu
 * @version : 1.0
 * @what's new :
 */
function imageTabController(o) {
	var ulobj,ulchild;
	var to = document.getElementById(o);

	function clearStatus() {
		var eventTarget;
		for(i=0;i<ulchild.length;i++) {
			eventTarget = ulchild[i].getElementsByTagName('a')[0];
			tmpId = eventTarget.href.split("#")[1];
			document.getElementById(tmpId).style.display = "none";
			ulchild[i].getElementsByTagName('img')[0].onmouseout();
		}
	}

	function imageControll(imglist,current) {
		for(z=0;z<imglist.length;z++) {
			if(imglist[z] == current) {
				current.onmouseover();
				current.onmouseover = function() { return false; }
				current.onmouseout = function() { return false; }
			}
			else {
				imglist[z].onmouseover = function() { menuOn(this) }
				imglist[z].onmouseout = function() { menuOut(this) }
				imglist[z].onmouseout();
			}
		}
	}

	this.initialize = function() {
		ulobj = to;
		ulchild = removeNullNode(ulobj.childNodes);

		clearStatus();
		this.givefunc();
	}

	this.givefunc = function() {
		for(i=0;i<ulchild.length;i++) {
				eventTarget = ulchild[i].getElementsByTagName('a')[0];
				eventTarget.onfocus =
				eventTarget.onclick = function() {
				clearStatus();
				tmpId = this.href.split("#")[1];
				document.getElementById(tmpId).style.display = "block";
				tmpimageList = this.parentNode.parentNode.getElementsByTagName('img');
				imageControll(tmpimageList,this.getElementsByTagName('img')[0]);
				return false;
			}
		}
	}

	this.runActive = function() {
		if(this.activeCode) {
			ulchild[this.activeCode-1].getElementsByTagName('a')[0].onclick();
		} else {
			ulchild[0].getElementsByTagName('a')[0].onclick();
		}
	}
}


	/* OBJECT  */
	function makeobject(type,path,w,h,id,vars,transparent,bg) {
		this.type = type; // flash, applet, movie
		this.id = id;
		this.path = path;
		this.w = w;
		this.h = h;
		this.vars = (vars) ? vars : '';
		this.trnasparent = (transparent) ? transparent : 'transparent';
		this.bg = (bg) ? bg : '#ffffff';

		this.gettag =
			function() {
				switch(this.type) {
					case 'flash' :
						this.classid = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000';
						this.codebase = 'http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0';
						this.tag = "<object classid='"+this.classid+"' codebase='"+this.codebase+"' id='"+this.id+"' width='"+this.w+"' height='"+this.h+"'>";
						this.tag += "<param name='movie' value='"+this.path+"' />";
						this.tag += "<param name='allowScriptAccess' value='always' />";
						if(this.vars) this.tag += "<param name='FlashVars' value='"+this.vars+"' />";
						if(this.trnasparent) this.tag += "<param name='wmode' value='"+this.trnasparent+"' />";
						this.tag += "<param name='menu' value='false' />";
						this.tag += "<param name='quality' value='high' />"
						this.tag += "<param name='bgcolor' value='"+this.bg+"' />";
						this.tag += "<param value='"+this.path+"'>";
						this.tag += "<param name='base' value='.'>";
						this.tag += "<embed src='"+this.path+"'";
						if(this.vars) this.tag += " FlashVars='"+this.vars+"'";
						if(this.trnasparent) this.tag += " wmode='"+this.trnasparent+"'";
						this.tag += " width='"+this.w+"'";
						this.tag += " height='"+this.h+"'";
						this.tag += " bgcolor='"+this.bg+"'";
						this.tag += " name='"+this.id+"'";
						this.tag += " menu='false'";
						this.tag += " quality='high'";
						this.tag += " allowScriptAccess='always'";
						this.tag += " type='application/x-shockwave-flash'";
						this.tag += " pluginspage='http://www.macromedia.com/go/etflashplayer'";
						this.tag += " />";
						this.tag += "</object>";
						return this.tag;
						break;
					case 'midia' :
						this.classid = 'clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95';
						this.codebase = 'http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0';
						this.tag = "<object classid='"+this.classid+"' codebase='"+this.codebase+"' id='"+this.id+"' width='"+this.w+"' height='"+this.h+"'>";
						this.tag += "<param name='movie' value='"+this.path+"' />";
						this.tag += "<param name='allowScriptAccess' value='always' />";
						if(this.vars) this.tag += "<param name='FlashVars' value='"+this.vars+"' />";
						if(this.trnasparent) this.tag += "<param name='wmode' value='"+this.trnasparent+"' />";
						this.tag += "<param name='menu' value='false' />";
						this.tag += "<param name='quality' value='high' />"
						this.tag += "<param name='bgcolor' value='"+this.bg+"' />";
						this.tag += "<param value='"+this.path+"'>";
						this.tag += "<param name='base' value='.'>";
						this.tag += "<embed src='"+this.path+"'";
						if(this.vars) this.tag += " FlashVars='"+this.vars+"'";
						if(this.trnasparent) this.tag += " wmode='"+this.trnasparent+"'";
						this.tag += " width='"+this.w+"'";
						this.tag += " height='"+this.h+"'";
						this.tag += " bgcolor='"+this.bg+"'";
						this.tag += " name='"+this.id+"'";
						this.tag += " menu='false'";
						this.tag += " quality='high'";
						this.tag += " allowScriptAccess='always'";
						this.tag += " type='application/x-mplayer2";
						this.tag += " pluginspage='http://www.macromedia.com/go/etflashplayer'";
						this.tag += " />";
						this.tag += "</object>";
						return this.tag;
						break;
				}

			}

		this.writetag =
			function() {
				document.write(this.gettag());
				eval("window." + this.id + " = document.getElementById('" + this.id + "');");
			}
	}

	var displayController = function(obj,swit) {
		getobj = document.getElementById(obj);
		switch(swit) {
			case 'on':getobj.style.display='block';break;
			case 'off':getobj.style.display='none';break;
		}
	}

	function removeNullNode(obj) {
		for(k=0;k<obj.length;k++) {
			if(obj[k].nodeType != 1) obj[k].parentNode.removeChild(obj[k]);
		}

		return obj;
	}

	function menuOn(imgEl)
	{
	  if(imgEl.src.indexOf("_on") < 0) imgEl.src = imgEl.src.replace(".gif", "_on.gif");
	}

	function menuOut(imgEl)
	{
	  imgEl.src = imgEl.src.replace("_on.gif", ".gif");
	}

	var NavigationController = function(obj) {

		var tobj;
		var activeD1,activeD2;
		var activeD1class,activeD2class,activeD3class;
		var nodetree,menuTimer;

		this.tobj = document.getElementById(obj);
		this.initialize = function() {
			activeD1 = (this.activeD1=='undefined' || this.activeD1<0 || isNaN(this.activeD1)) ? false : this.activeD1;
			activeD2 = (this.activeD2=='undefined' || this.activeD2<0 || isNaN(this.activeD2)) ? false : this.activeD2;
			
			activeD1class = (this.activeD1class!='undefined') ? this.activeD1class : false;
			activeD2class = (this.activeD2class!='undefined') ? this.activeD2class : false;

			tobj = this.tobj.getElementsByTagName('ul')[0];
			nodetree = removeNullNode(tobj.childNodes);

			giveFunc();
		}

		function giveFunc() { 

			for(i=0;i<nodetree.length;i++) {
				nodetree[i].getElementsByTagName('a')[0].onfocus =   
				nodetree[i].getElementsByTagName('a')[0].onmouseover = function() {
					clearInterval(menuTimer);
					displaysubmenu(this.parentNode);
				} 
				
				nodetree[i].onfocus =   
				nodetree[i].onmouseover = function() {
					clearInterval(menuTimer);
					displaysubmenu(this);
				}			

				nodetree[i].onblur =
				nodetree[i].onmouseout = function() {
					clearInterval(menuTimer);
					initializeTimer(this);
				}
				
			}

			currentNodeActive(tobj);
		}

		function currentNodeActive(tobj) { 

			if(typeof(activeD1) == 'number') {
				displaysubmenu(nodetree[activeD1]);
				
			} else {
				clearSubmenu(tobj);
			}
			
			if(typeof(activeD1) == 'number') {	
				tnodetree = (nodetree[activeD1].getElementsByTagName('ul')[0]) ? removeNullNode(nodetree[activeD1].getElementsByTagName('ul')[0].childNodes)[activeD2] : false;
				if(tnodetree) displaysubmenuImage(tnodetree);		
			} else {
				clearSubmenu(tobj);

			}		
		}

		function displaysubmenu(n) { 
			var ncheck = (n.getElementsByTagName('ul')[0]) ? true : false;

			clearSubmenu(n.parentNode);

			if(ncheck) n.getElementsByTagName('div')[0].style.display = "block";
			n.className = n.className + " on";

			displaysubmenuImage(n);
		}
		
		function displaysubmenuImage(n) { 
			
			var imageCheck = (n.getElementsByTagName('img')[0]) ? n.getElementsByTagName('img')[0] : false;
			if(imageCheck) imageCheck.onmouseover();
			
		}

		function initializeTimer(n) {

			menuTimer = setInterval(function() {
				clearSubmenu(n.parentNode);
				currentNodeActive();
			},500);
			
		}

		function clearSubmenu(n) { 

			var ncheck;
			var n = removeNullNode(n.childNodes);
			for(i=0;i<n.length;i++) {
				n[i].className = n[i].className.split("on")[0];
				ncheck = (n[i].getElementsByTagName('ul')[0]) ? true : false;
				if(ncheck) n[i].getElementsByTagName('div')[0].style.display = "none";

				var imageCheck = (n[i].getElementsByTagName('img')[0]) ? n[i].getElementsByTagName('img')[0] : false;
				if(imageCheck) imageCheck.onmouseout();
				
			}
		}
	}



function removeNullNode(obj) {
	for(k=0;k<obj.length;k++) {
		if(obj[k].nodeType != 1) obj[k].parentNode.removeChild(obj[k]);
	}

	return obj;
}

function nextNode(o) {
	o = o.nextSibling;
	while(o) {
		if(o.nodeType != 1) o = o.nextSibling;
		else break;
	}
	return o;
}

function findParentNode(o,e) {
	while(o) {
		o = o.parentNode;
		if(o.nodeName.toLowerCase() == e) break;
	}
	return o;
}



function FaqController(o) {
	var o = document.getElementById(o);
	var list = removeNullNode(o.getElementsByTagName('dl').item(0).childNodes);
	var recentStatus = false;
	this.run = function() {
		this.init(this.activeCode,this.activeClassQ,this.activeClassA);
	}
	this.init = function(activeCode,activeClassQ,activeClassA) {
		var anc;
		for(i=0;i<list.length;i++) {
			anc = list.item(i);
			if(anc.nodeName.toLowerCase() == 'dt') {
				anc.onfocus =
				anc.onclick = function() {
					pNode = removeNullNode(findParentNode(this,'dl').childNodes);
					nNode = nextNode(this);
					for(j=0;j<pNode.length;j++) {
						if(pNode[j].nodeName.toLowerCase() == 'dd') {
							if(pNode[j] == nNode) {
								if(pNode[j].style.display == "block") {
									if(activeClassA) pNode[j].className = pNode[j].className.replace(activeClassA,'');
									pNode[j].style.display = "none";
								} else {
									check = pNode[j].className.indexOf(activeClassA);
									if(check == -1 || check == 2) pNode[j].className = pNode[j].className + " " + activeClassA;
									pNode[j].style.display = "block";
								}
							} else {
								if(activeClassA) pNode[j].className = pNode[j].className.replace(activeClassA,'');
								pNode[j].style.display = "none";
							}
						} else {
							if(pNode[j] == this) {
								if(activeClassQ) {
									check = pNode[j].className.indexOf(activeClassQ);
									if(check == -1 || check == 2) pNode[j].className = pNode[j].className + " " + activeClassQ;
								}
							} else {
								if(activeClassQ) pNode[j].className = pNode[j].className.replace(activeClassQ,'');
							}
						}
					}
				}
			}
		}
		if(activeCode) {
			dtlayer = removeNullNode(o.getElementsByTagName('dt'));
			dtlayer[activeCode-1].onclick();
		}
	}
}


window.onload=function(){
$("#siteBody").css("display","none");
$("#siteToggle").toggle(

 function(){
$(".viewImg").attr("src","../images/common/img_list_on.gif")
 $("#siteBody").show();
 },
 function(){
	$(".viewImg").attr("src","../images/common/img_list.gif")
 $("#siteBody").hide();
 });

$('.sgnb div ul li').hover(
	function(){
		if ( $(this).hasClass('select') ) return false;
		$(this).find('img').attr('src', $(this).find('img').attr('src').replace('.png','_on.png'))
	},
	function(){
		if ( $(this).hasClass('select') ) return false;
		$(this).find('img').attr('src', $(this).find('img').attr('src').replace('_on.png','.png'))
	});

$('.gnb li').hover(
	function(){
		$(this).children("h2").children("img").attr('src', $(this).children("h2").children("img").attr('src').replace('.gif', '_on.gif'))
		if ( $(this).hasClass('select') ) return false;
		$(this).children("h2").siblings('.sgnb').children('div').attr('class', 'subGnbOver')
	},
	function(){
		$(this).children("h2").children('img').attr('src', $(this).children("h2").children("img").attr('src').replace('_on.gif', '.gif'))
		if ( $(this).hasClass('select') ) return false;
		$(this).children("h2").siblings('.sgnb').children('div').attr('class', 'subGnb')
	});


 };


 /* png24 */
function setPng24(obj) {
var tempsw=-1;
        if( navigator.appVersion.indexOf("MSIE 6") > -1){
 obj.width=obj.height=1;
 obj.className=obj.className.replace(/png24/i,'');
 var tempobjsrc=obj.src;
 tempsw=tempobjsrc.indexOf('http://');
 if(tempsw>=0){
 tempobjsrc=tempobjsrc.replace('http://', '');
 }
  tempobjsrc= escape(tempobjsrc);
 if(tempsw>=0){
  tempobjsrc='http://' + tempobjsrc;
 }

 obj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+ tempobjsrc +"',sizingMethod='image');";
 obj.src='';
}
 return '';
}

function viewLayer(num){
var Img = $("#gnb"+num);
var Src = '../images/gnb/top_subMenu0'
$("#header").animate({"height":"302px"},400);
/*
	if ( Img.attr('src').indexOf("_on.gif") != -1 ){
	closeLayer()
	return false;
	};
*/
	for ( var i = 1 ; i < 7 ; i++ ){
		var a = $("#sub" + i + " li a img")
		if (num == i){
//			if (num == 2){
//				$('.subGnbSearch').css({"display":"block"})
//				$('.sgnb').css({"display":"none"})
//			}else{
//				$('.subGnbSearch').css({"display":"none"})
//				$('.sgnb').css({"display":"block"})
//			}
			$("#gnb" + i).attr("src", Src+i+'_on.gif' );
			$("#gnb" + i).attr("name", Src+i+'_on.gif' );
			$("#gnb_0" + i + " div").attr('class', ' subGnbOver ')
			
		}else{
			$("#gnb" + i).attr("src", Src+i+'.gif' );
			$("#gnb_0" + i + " div").attr('class', ' subGnb')
		}
	};

	$('#gnb_close').delay(200).fadeIn(100);
};

function closeLayer(){
	$("#header").animate({"height":"78px"},400);
	for ( var i = 1 ; i < 7 ; i++ ){
	var overImg = $("#gnb"+i);
	overImg.attr("src", "../images/gnb/top_subMenu0"+i+".gif")
	};
	$('#gnb_close').hide();
};