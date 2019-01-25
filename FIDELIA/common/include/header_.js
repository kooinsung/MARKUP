function lnbMenu01 (num1,num2){
	document.write("<header class='subHeader'>");
	document.write("<h1><a href='../index.html'><img src='../images/common/logo_bogg.png' alt='bogg' /></a></h1>");
	document.write("<p><a href=''><img src='../images/btn/btn_kor_on.png' alt='KOR' class='overImg'/></a><a href='#none' onclick='engAlert();'><img src='../images/btn/btn_eng_off.png' alt='ENG' class='overImg'/></a></p>");
	document.write("<nav>");
	document.write("<ul id='topmenu'>");
	document.write("<li>");
	if(num1==1){
		document.write("<a href='../introduce/Story.html'><img src='../images/common/gnb01_on.gif' alt='브랜드 소개' /></a>");
		document.write("<ul class='sub01'>");
			if(num2==1){
				document.write("<li><a href='../introduce/Story.html'><img src='../images/common/gnb01-1_on.gif' alt='Brand Story & Concept ' class='overImg' /></a></li>");
			}else{
				document.write("<li><a href='../introduce/Story.html'><img src='../images/common/gnb01-1_off.gif' alt='Brand Story & Concept ' class='overImg' /></a></li>");
			}
			if(num2==2){
				document.write("<li><a href='../introduce/Designer.html'><img src='../images/common/gnb01-2_on.gif' alt='디자이너 소개' class='overImg' /></a></li>");
			}else{
				document.write("<li><a href='../introduce/Designer.html'><img src='../images/common/gnb01-2_off.gif' alt='디자이너 소개' class='overImg' /></a></li>");
			}
			if(num2==3){
				document.write("<li><a href='../introduce/PR_Gallery.html'><img src='../images/common/gnb01-3_on.gif' alt='PR Gallery ' class='overImg' /></a></li>");
			}else{
				document.write("<li><a href='../introduce/PR_Gallery.html'><img src='../images/common/gnb01-3_off.gif' alt='PR Gallery ' class='overImg' /></a></li>");
			}
			if(num2==4){
				document.write("<li><a href='../introduce/Report.html'><img src='../images/common/gnb01-4_on.gif' alt='보도자료' class='overImg' /></a></li>");
			}else{
				document.write("<li><a href='../introduce/Report.html'><img src='../images/common/gnb01-4_off.gif' alt='보도자료' class='overImg' /></a></li>");
			}
	}else{
		document.write("<a href='../introduce/Story.html'><img src='../images/common/gnb01_off.gif' alt='브랜드 소개' /></a>");
		document.write("<ul class='sub01'>");
		document.write("<li><a href='../introduce/Story.html'><img src='../images/common/gnb01-1_off.gif' alt='Brand Story & Concept ' class='overImg' /></a></li>");
		document.write("<li><a href='../introduce/Designer.html'><img src='../images/common/gnb01-2_off.gif' alt='디자이너 소개' class='overImg' /></a></li>");
		document.write("<li><a href='../introduce/PR_Gallery.html'><img src='../images/common/gnb01-3_off.gif' alt='PR Gallery ' class='overImg' /></a></li>");
		document.write("<li><a href='../introduce/Report.html'><img src='../images/common/gnb01-4_off.gif' alt='보도자료' class='overImg' /></a></li>");
	}
	document.write("</ul>");
	document.write("</li>");
	document.write("</ul>");
	document.write("</nav>");
}



