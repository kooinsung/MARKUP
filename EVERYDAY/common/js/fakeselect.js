
// 셀렉트 박스에 디자인을 입히기 위한 대체 스크립트
// http://www.psyonline.kr

// 옵션설정
fakeselect.initialize=function(){
	fakeselect({
		targetclassname : '',
		title : {
			defaultwidth : 75,
			classname : 'selectbox_title',
			focusclassname : 'selectbox_title_focus',
			innerhtml : '<strong></strong>',
			widthminus : 20
		},
		option : {
			classname : 'selectbox_option',
			innerhtml : '<div class="scroll"></div>',
			position : -1,
			upperposition : 1,
			zindex : 10,
			widthminus : 2,
			maxitems : 10,
			onclassname : 'on'
		}
	});
}

function fakeselect(v){

	var isie=navigator.userAgent.match(/msie/i);
	var isfirefox=navigator.userAgent.match(/firefox/i);
	var isopera=navigator.userAgent.match(/opera/i);
	var isapple=navigator.userAgent.match(/applewebkit/i);

	if(!v.title.defaultwidth) v.title.defaultwidth=75;
	if(!v.option.position) v.option.position=-1;
	if(!v.option.upperposition) v.option.upperposition=1;
	if(!v.option.zindex) v.option.zindex=1;

	var sels=document.getElementsByTagName('select');
	for(var i=0,max=sels.length; i<max; i++){
		if(!v.targetclassname || (v.targetclassname && (v.targetclassname==sels[i].className))){
			if(!sels[i].ac){
				sels[i].ac=create(sels[i]);
				sels[i].change=function(){
					this.ac.ckdisable();
					this.ac.tg.innerHTML=(this.options.length)? this.options[this.selectedIndex].text : '';
					this.ac.optionfocus();
				}
				sels[i].sf_change=sels[i].onchange;
				sels[i].sf_mouseover=sels[i].onmouseover;
				sels[i].sf_mouseout=sels[i].onmouseout;
				sels[i].sf_click=sels[i].onclick;
				sels[i].onchange=function(){
					this.change();
					if(this.sf_change) this.sf_change();
				}
			}else sels[i].reset();
		}
	}

	function create(selobj){

		function rc(v,isoption){
			if(!isoption){
				selobj.noww=getwidth();
				var width=(v.widthminus)? selobj.noww-v.widthminus : selobj.noww;
				var tagname='span';
				var style='width:'+width+'px;vertical-align:middle;cursor:pointer;display:';
				var disp=(selobj.style.display)? selobj.style.display : (selobj.currentStyle)? selobj.currentStyle['display'] : window.getComputedStyle(selobj,null)['display'];
				if(disp=='none'){
					style+='none';
					selobj.style.display='none';
				}else style+='inline-block';
				if(selobj.className) v.classname+=' '+selobj.className;
			}else{
				var width=(v.widthminus)? selobj.noww-v.widthminus : selobj.noww;
				var tagname='div';
				var style='position:absolute;width:'+width+'px;display:none;z-index:'+v.zindex;
				selobj.style.position='absolute';
				selobj.style.left='-100000px';
			}
			if(isie) var rv=document.createElement('<'+tagname+' class="'+((v.classname)? v.classname : '')+'" style="'+style+'">');
			else{
				var rv=document.createElement(tagname);
				if(v.classname) rv.setAttribute('class',v.classname);
				rv.setAttribute('style',style);
			}
			if(v.innerhtml){
				rv.innerHTML=v.innerhtml;
				rv.tg=rv.childNodes[0];
				for(var i=0; i<1; i++){
					if(isoption && rv.tg.className=='scroll') rv.scrobj=rv.tg;
					if(rv.tg.childNodes[0]){
						rv.tg=rv.tg.childNodes[0];
						i--;
					}
				}
			}else rv.tg=rv;
			return rv;
		}

		function getwidth(){
			var rv=(selobj.style.width)? parseInt(selobj.style.width) : selobj.offsetWidth;
			if(!rv) rv=parseInt((selobj.currentStyle)? selobj.currentStyle['width'] : window.getComputedStyle(selobj,null)['width']);
			if(!rv) rv=v.title.defaultwidth;
			return rv;
		}

		selobj.reset=function(){
			this.change();
			this.style.height='auto'; //ie bug
			var noww=getwidth();
			if(noww!=this.noww){
				selobj.ac.style.width=(v.title.widthminus)? (noww-v.title.widthminus)+'px' : noww+'px';
				selobj.ac.opt.style.width=(v.option.widthminus)? (noww-v.option.widthminus)+'px' : noww+'px';
				selobj.noww=noww;
			}
		}
		selobj.show=function(){
			this.style.display='inline';
			this.ac.style.display='inline-block';
			this.reset();
		}
		selobj.hide=function(){
			this.style.display='none';
			this.ac.style.display='none';
		}

		var ac=rc(v.title);
		if(selobj.length){
			if(ac.tg) ac.tg.innerHTML=selobj.options[selobj.selectedIndex].text;
			else ac.innerHTML=selobj.options[selobj.selectedIndex].text;
		}
		ac.onclick=function(){
			if(selobj.disabled) return false;
			if(this.opt.style.display=='block'){
				this.opt.style.display='none';
				//selobj.focus();
				return false;
			}
			setoptions();
			this.optionfocus();
			this.opt.style.left='-100000px';
			this.opt.style.display='block';
			if(this.opt.scrobj){
				if(selobj.scroll){
					var sto=this.opt.getElementsByTagName('li')[0];
					this.opt.scrobj.style.height=sto.offsetHeight*v.option.maxitems+'px';
					this.opt.scrobj.scrollTop=sto.offsetHeight*selobj.selectedIndex;
					this.opt.scrobj.style.overflow='auto';
					this.opt.scrobj.style.overflowX='hidden';
				}else{
					this.opt.scrobj.style.height='auto';
					this.opt.scrobj.style.overflow='hidden';
				}
			}
			var pos=[0,0];
			function addpos(left,top){
				pos[0]+=left;
				pos[1]+=top;
			}
			for(var i=0,cobj=this; !cobj.tagName.toLowerCase().match(/body|html/); cobj=cobj.offsetParent,i++){
				addpos(cobj.offsetLeft,cobj.offsetTop);
				if(!isopera && i>0){
					if(isie) addpos(cobj.clientLeft,cobj.clientTop);
					else if(cobj.tagName.toLowerCase().match(/table|thead|tbody|tfoot|th|td/)){
						if(isapple) addpos(cobj.clientLeft,cobj.clientTop);
						else addpos(cobj.offsetWidth-cobj.clientWidth,cobj.offsetHeight-cobj.clientHeight);
					}
				}
			}
			var sch=(isapple)? document.body.scrollTop : document.documentElement.scrollTop;
			var isupper=((pos[1]+this.offsetHeight+this.opt.offsetHeight)>(document.documentElement.clientHeight+sch));
			this.opt.style.left=pos[0]+'px';
			this.opt.style.top=(isupper)? (pos[1]-this.opt.offsetHeight+v.option.upperposition)+'px' : (pos[1]+this.offsetHeight+v.option.position)+'px';

			if(selobj.sf_click) selobj.sf_click();

			return false;
		}

		ac.optionfocus=function(offall){
			var opts=(this.opt.tg)? ac.opt.tg.getElementsByTagName('a') : this.opt.getElementsByTagName('a');
			for(var i=0,max=opts.length; i<max; i++) opts[i].className=(offall)? '' : (i==selobj.selectedIndex)? v.option.onclassname : '';
		}

		ac.ckdisable=function(){
			var opacity=(selobj.disabled)? 50 : 100;
			if(isie) ac.style.filter='alpha(opacity='+opacity+')';
			else ac.style.opacity=opacity/100;
		}
		ac.ckdisable();

		ac.opt=rc(v.option,true);

		ac.focusing=function(){
			if(!selobj.disabled){
				this.className+=' '+v.title.focusclassname;
				if(isie) this.onmousewheel=wheelaction;
				else this.addEventListener(((isfirefox)? 'DOMMouseScroll' : 'mousewheel'),wheelaction,false);
			}
		}
		ac.bluring=function(){
			if(!selobj.disabled){
				this.className=this.className.replace(new RegExp(' '+v.title.focusclassname,'g'),'');
				if(isie) this.onmousewheel=null;
				else this.removeEventListener(((isfirefox)? 'DOMMouseScroll' : 'mousewheel'),wheelaction,false);
			}
		}
		selobj.onfocus=function(){
			ac.focusing();
		}
		selobj.onblur=function(){
			ac.bluring();
		}

		if(!isie && !isopera){
			selobj.onkeydown=function(e){
				var kc=e.keyCode;
				if(kc==38){
					setselected('up');
					return false;
				}else if(kc==40){
					setselected('down');
					return false;
				}
			}
		}

		function setoptions(){
			var max=selobj.options.length;
			selobj.scroll=(v.option.maxitems && (max>v.option.maxitems));
			var inhtml='<ul>';
			for(var i=0; i<max; i++) inhtml+='<li><a href="#">'+selobj.options[i].text+'</a></li>';
			inhtml+='</ul>';
			if(ac.opt.tg){
				ac.opt.tg.innerHTML=inhtml;
				var opts=ac.opt.tg.getElementsByTagName('a');
			}else{
				ac.opt.innerHTML=inhtml;
				var opts=ac.opt.getElementsByTagName('a');
			}
			for(var i=0,max=opts.length; i<max; i++){
				opts[i].i=i;
				opts[i].onclick=function(){
					ac.opt.style.display='none';
					ac.tg.innerHTML=selobj.options[this.i].text;
					selobj.options[this.i].selected='selected';
					selobj.onchange();
					//selobj.focus();
					return false;
				}
			}
		}

		function setselected(f){
			if(f=='up' && selobj.selectedIndex>0){
				selobj.options[selobj.selectedIndex-1].selected='selected';
				changed=true;
			}else if(f=='down' && selobj.selectedIndex<(selobj.options.length-1)){
				selobj.options[selobj.selectedIndex+1].selected='selected';
				changed=true;
			}
			if(changed && ac.opt.scrobj && selobj.scroll){
				var sto=ac.opt.getElementsByTagName('li')[0];
				ac.opt.scrobj.scrollTop=sto.offsetHeight*selobj.selectedIndex;
			}
			selobj.onchange();
		}

		function wheelaction(e){
			if(isie) e=window.event;
			if(selobj.options.length>1){
				var wv=(e.wheelDelta)? e.wheelDelta : e.detail;
				wv=(isfirefox)? (wv<0)? 'up' : 'down' : (wv>0)? 'up' : 'down';
				setselected(wv);
			}
			if(e.preventDefault) e.preventDefault();
			return false;
		}

		var optclosetimer=null;
		ac.onmouseover=function(e){
			clearTimeout(optclosetimer);
			if(selobj.sf_mouseover){
				if(!e) e=window.event;
				if(checkevents(e,this)) selobj.sf_mouseover();
			}
		}
		ac.onmouseout=function(e){
			optclosetimer=setTimeout(optclose,100);
			if(selobj.sf_mouseout){
				if(!e) e=window.event;
				if(checkevents(e,this)) selobj.sf_mouseout();
			}
		}
		ac.opt.onmouseover=function(){
			clearTimeout(optclosetimer);
		}
		ac.opt.onmouseout=function(){
			optclosetimer=setTimeout(optclose,100);
		}
		function optclose(){
			if(ac.opt.style.display=='block'){
				ac.opt.style.display='none';
				try{
					selobj.focus();
				} catch(e){
					
				}
			}
		}

		function checkevents(e,tg){
			var etg=(e.target)? e.target : e.srcElement;
			if(etg!=tg) return false;
			var ereltg=(e.relatedTarget)? e.relatedTarget : (e.type=='mouseover')? e.fromElement : e.toElement;
			if(ereltg){
				while(ereltg!=tg && !ereltg.tagName.match(/(body|html)/i)) ereltg=ereltg.parentNode;
				if(ereltg==tg) return false;
			}
			return true;
		}

		selobj.parentNode.insertBefore(ac,selobj);
		document.body.appendChild(ac.opt);

		return ac;

	}

}

if(navigator.userAgent.match(/msie/i)) window.attachEvent('onload',fakeselect.initialize);
else window.addEventListener('load',fakeselect.initialize,false);


