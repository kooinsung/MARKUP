function lnbMenu01 (num1,num2){
	document.write("<header class='subHeader'>");
	document.write("<h1><a href='../index.html'><img src='../images/common/logo_bogg.png' alt='bogg사이트 로고' /></a></h1>");
	document.write("<p><a href='../index.html'><img src='../images/btn/btn_kor_on.png' alt='국문사이트 이동 /' class='overImg'/></a><a href='../english/index.html'><img src='../images/btn/btn_eng_off.png' alt=' 영문사이트 이동' class='overImg'/></a></p>");
	document.write("<h2 class='hidden'>메뉴</h2>");
	document.write("<nav>");
	document.write("<ul id='topmenu'>");
	document.write("<li class='first'>");
	if(num1==1){
		document.write("<a href='../introduce/Story.html'><img src='../images/common/gnb01_on.gif' alt='브랜드 소개' /></a>");
		document.write("<ul class='sub01' style='display:block;'>");
			if(num2==1){
				document.write("<li class='subFirst'><a href='../introduce/Story.html'><img src='../images/common/gnb01-1_on.gif' alt='Brand Story & Concept ' class='overImg' /></a></li>");
			}else{
				document.write("<li class='subFirst'><a href='../introduce/Story.html'><img src='../images/common/gnb01-1_off.gif' alt='Brand Story & Concept ' class='overImg' /></a></li>");
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
				document.write("<li class='subLast'><a href='../introduce/Report.html'><img src='../images/common/gnb01-4_on.gif' alt='보도자료' class='overImg' /></a></li>");
			}else{
				document.write("<li class='subLast'><a href='../introduce/Report.html'><img src='../images/common/gnb01-4_off.gif' alt='보도자료' class='overImg' /></a></li>");
			}

	}else{
		document.write("<a href='../introduce/Story.html'><img src='../images/common/gnb01_off.gif' alt='브랜드 소개' /></a>");
		document.write("<ul class='sub01'>");
		document.write("<li class='subFirst'><a href='../introduce/Story.html'><img src='../images/common/gnb01-1_off.gif' alt='Brand Story & Concept ' class='overImg' /></a></li>");
		document.write("<li><a href='../introduce/Designer.html'><img src='../images/common/gnb01-2_off.gif' alt='디자이너 소개' class='overImg' /></a></li>");
		document.write("<li><a href='../introduce/PR_Gallery.html'><img src='../images/common/gnb01-3_off.gif' alt='PR Gallery ' class='overImg' /></a></li>");
		document.write("<li class='subLast'><a href='../introduce/Report.html'><img src='../images/common/gnb01-4_off.gif' alt='보도자료' class='overImg' /></a></li>");

	}
	document.write("</ul>");
	document.write("</li>");
	document.write("<li class='second'>");
	if(num1==2){
		document.write("<a href='../collection/PatchWork.html'><img src='../images/common/gnb02_on.gif' alt='bogg 컬렉션' /></a>");
		document.write("<ul class='sub02' style='display:block;'>");
			if(num2==5){
				document.write("<li class='subFirst'><a href='../collection/PatchWork.html'><img src='../images/common/gnb02-1_on.gif' alt='PATCHWORK' class='overImg' /> </a></li>");
			}else{
				document.write("<li class='subFirst'><a href='../collection/PatchWork.html'><img src='../images/common/gnb02-1_off.gif' alt='PATCHWORK' class='overImg' /> </a></li>");
			}
			if(num2==6){
				document.write("<li><a href='../collection/GardenCollection.html'><img src='../images/common/gnb02-2_on.gif' alt='GARDEN COLLECTION' class='overImg' /> </a></li>");
			}else{
				document.write("<li><a href='../collection/GardenCollection.html'><img src='../images/common/gnb02-2_off.gif' alt='GARDEN COLLECTION' class='overImg' /> </a></li>");
			}
			if(num2==7){
				document.write("<li class='subLast'><a href='../collection/BoggCollection.html'><img src='../images/common/gnb02-3_on.gif' alt='BOGG COLLECTION' class='overImg' /> </a></li>");
			}else{
				document.write("<li class='subLast'><a href='../collection/BoggCollection.html'><img src='../images/common/gnb02-3_off.gif' alt='BOGG COLLECTION' class='overImg' /> </a></li>");
			}

	}else{
		document.write("<a href='../collection/PatchWork.html'><img src='../images/common/gnb02_off.gif' alt='bogg 컬렉션' /></a>");
		document.write("<ul class='sub02'>");
		document.write("<li class='subFirst'><a href='../collection/PatchWork.html'><img src='../images/common/gnb02-1_off.gif' alt='PATCHWORK' class='overImg' /> </a></li>");
		document.write("<li><a href='../collection/GardenCollection.html'><img src='../images/common/gnb02-2_off.gif' alt='GARDEN COLLECTION' class='overImg' /> </a></li>");
		document.write("<li class='subLast'><a href='../collection/BoggCollection.html'><img src='../images/common/gnb02-3_off.gif' alt='BOGG COLLECTION' class='overImg' /> </a></li>");
	}
	document.write("</ul>");
	document.write("</li>");
	document.write("<li class='third'>");
	if(num1==3){
		document.write("<a href='../cultureframe/CultureFrame.html'><img src='../images/common/gnb03_on.gif' alt='문화공감' /></a>");
		//document.write("<ul class='sub03' style='display:block;'>");
		//	if(num2==12){
		//document.write("<li class='subFirst subLast'><a href='../cultureframe/CultureFrame.html'><img src='../images/common/gnb03-1_on.gif' alt='파워블로그들과의 만남' class='overImg' /></a></li>");
		//	}else{
		//document.write("<li class='subFirst subLast'><a href='../cultureframe/CultureFrame.html'><img src='../images/common/gnb03-1_off.gif' alt='파워블로그들과의 만남' class='overImg' /></a></li>");
		//	}

	}else{
		document.write("<a href='../cultureframe/CultureFrame.html'><img src='../images/common/gnb03_off.gif' alt='문화공감' /></a>");
		//document.write("<ul class='sub03'>");
		//document.write("<li class='subFirst subLast'><a href='../cultureframe/CultureFrame.html'><img src='../images/common/gnb03-1_off.gif' alt='파워블로그들과의 만남' class='overImg' /></a></li>");
	}
	//document.write("</ul>");
	document.write("</li>");
	document.write("<li class='forth'>");
	if(num1==4){
		document.write("<a href='../product/SuimaCotton.html'><img src='../images/common/gnb04_on.gif' alt='product' /></a>");
		document.write("<ul class='sub04' style='display:block;'>");
			if(num2==14){
				document.write("<li class='subFirst'><a href='../product/SuimaCotton.html'><img src='../images/common/gnb04-1_on.gif' alt='Supima Cotton' class='overImg' /> </a></li>");
			}else{
				document.write("<li class='subFirst'><a href='../product/SuimaCotton.html'><img src='../images/common/gnb04-1_off.gif' alt='Supima Cotton' class='overImg' /> </a></li>");
			}
			if(num2==15){
				document.write("<li class='subLast'><a href='../product/PremiumGooseDawn.html'><img src='../images/common/gnb04-2_on.gif' alt='Premium Goose Dawn' class='overImg' /> </a></li>");
			}else{
				document.write("<li class='subLast'><a href='../product/PremiumGooseDawn.html'><img src='../images/common/gnb04-2_off.gif' alt='Premium Goose Dawn' class='overImg' /> </a></li>");
			}

	}else{
		document.write("<a href='../product/SuimaCotton.html'><img src='../images/common/gnb04_off.gif' alt='product' /></a>");
		document.write("<ul class='sub04'>");
				document.write("<li class='subFirst'><a href='../product/SuimaCotton.html'><img src='../images/common/gnb04-1_off.gif' alt='Supima Cotton' class='overImg' /> </a></li>");
				document.write("<li class='subLast'><a href='../product/PremiumGooseDawn.html'><img src='../images/common/gnb04-2_off.gif' alt='Premium Goose Dawn' class='overImg' /> </a></li>");
	}
	document.write("</ul>");
	document.write("</li>");
	document.write("<li class='last'>");
	if(num1==5){
		document.write("<a href='../shop/all.html'><img src='../images/common/gnb05_on.gif' alt='shop' /></a>");
		document.write("<ul class='sub05' style='display:block;'>");
			if(num2==16){
				document.write("<li class='subFirst'><a href='../shop/all.html'><img src='../images/common/gnb05-1_on.gif' alt='all' class='overImg' /> </a></li>");
			}else{
				document.write("<li class='subFirst'><a href='../shop/all.html'><img src='../images/common/gnb05-1_off.gif' alt='all' class='overImg' /> </a></li>");
			}
			if(num2==17){
				document.write("<li><a href='../shop/PatchWork.html'><img src='../images/common/gnb05-2_on.gif' alt='GARDEN COLLECTION' class='overImg' /> </a></li>");
			}else{
				document.write("<li><a href='../shop/PatchWork.html'><img src='../images/common/gnb05-2_off.gif' alt='GARDEN COLLECTION' class='overImg' /> </a></li>");
			}
			if(num2==18){
				document.write("<li class='subLast'><a href='../shop/GardenCollection.html'><img src='../images/common/gnb05-3_on.gif' alt='BOGG COLLECTION' class='overImg' /> </a></li>");
			}else{
				document.write("<li class='subLast'><a href='../shop/GardenCollection.html'><img src='../images/common/gnb05-3_off.gif' alt='BOGG COLLECTION' class='overImg' /> </a></li>");
			}

	}else{
		document.write("<a href='../shop/all.html'><img src='../images/common/gnb05_off.gif' alt='shop' /></a>");
		document.write("<ul class='sub05'>");
		document.write("<li class='subFirst'><a href='../shop/all.html'><img src='../images/common/gnb05-1_off.gif' alt='all' class='overImg' /> </a></li>");
		document.write("<li><a href='../shop/PatchWork.html'><img src='../images/common/gnb05-2_off.gif' alt='GARDEN COLLECTION' class='overImg' /> </a></li>");
		document.write("<li class='subLast'><a href='../shop/GardenCollection.html'><img src='../images/common/gnb05-3_off.gif' alt='BOGG COLLECTION' class='overImg' /> </a></li>");
	}
	document.write("</ul>");
	document.write("</li>");


	document.write("</ul>");
	document.write("</nav>");
	document.write("</header>");
}



