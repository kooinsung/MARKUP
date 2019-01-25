function lnbMenu01(num){
	document.write("<h2><img src='http://image.cjmall.com/fidelia/images/about/h2_aboutFidelia.gif' alt='ABOUTFIDELIA'/></h2>");
	document.write("<nav class='lnb'>");
	document.write("<ul>");
	if(num==1){
		document.write("<li><a href='../AboutFidelia/BrandStory.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb01-1_on.gif' alt='BRAND STORY' class='rollover active' id='img'/></a></li>");
	}else{
		document.write("<li><a href='../AboutFidelia/BrandStory.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb01-1_off.gif' alt='BRAND STORY' class='rollover active' id='img'/></a></li>");
	}
	if(num==2){
		document.write("<li><a href='../AboutFidelia/BrandIdentity.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb01-2_on.gif' alt='BRAND IDENTITY' class='rollover' id='img'/></a></li>");
	}else{
		document.write("<li><a href='../AboutFidelia/BrandIdentity.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb01-2_off.gif' alt='BRAND IDENTITY' class='rollover' id='img'/></a></li>");
	}
	if(num==3){
		document.write("<li><a href='../AboutFidelia/BrandHistory.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb01-3_on.gif' alt='FIDELIA HISTORY' class='rollover' id='img'/></a></li>");
	}else{
		document.write("<li><a href='../AboutFidelia/BrandHistory.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb01-3_off.gif' alt='FIDELIA HISTORY' class='rollover' id='img'/></a></li>");
	}
	if(num==4){
		document.write("<li><a href='../AboutFidelia/DesignIntroduction.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb01-4_on.gif' alt='DESIGNER INTRODUCTION' class='rollover' id='img'/></a></li>");
	}else{
		document.write("<li><a href='../AboutFidelia/DesignIntroduction.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb01-4_off.gif' alt='DESIGNER INTRODUCTION' class='rollover' id='img'/></a></li>");
	}
	if(num==5){
		document.write("<li><a href='../AboutFidelia/BI.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb01-5_on.gif' alt='BI' class='rollover' id='img'/></a></li>");
	}else{
		document.write("<li><a href='../AboutFidelia/BI.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb01-5_off.gif' alt='BI' class='rollover' id='img'/></a></li>");
	}
	if(num==6){
		document.write("<li><a href='../AboutFidelia/GlobalFidelia.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb01-6_on.gif' alt='GLOBAL FIDELIA' class='rollover' id='img'/></a></li>");
	}else{
		document.write("<li><a href='../AboutFidelia/GlobalFidelia.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb01-6_off.gif' alt='GLOBAL FIDELIA' class='rollover' id='img'/></a></li>");
	}
	document.write("</ul>");
	document.write("</nav>");
}


function lnbMenu02 (num1,num2,num3) {
	document.write("<h2><img src='http://image.cjmall.com/fidelia/images/line/h2_line.gif' alt='FIDELIA LINE'/></h2>");
	document.write("<nav class='lnb'>");
	document.write("<ul>");
	if(num1==1){
		document.write("<li>");
		document.write("<a href='../FideliaLine/DesignerIntroduction01.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1_on.gif' alt='VERA WANG FOR FIDELIA'  class='rollover'/></a>");
		document.write("<ul class='depth2' style=''>");
			if(num2==1){
				document.write("<li><a href='../FideliaLine/DesignerIntroduction01.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-1_on.gif' alt='DESIGNER INTRODUCTION'  class='rollover'/></a></li>");
			}else{
				document.write("<li><a href='../FideliaLine/DesignerIntroduction01.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-1_off.gif' alt='DESIGNER INTRODUCTION'  class='rollover'/></a></li>");
			}
			if(num2==2){
				document.write("<li><a href='../FideliaLine/BrandIntroduction.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-5_on.gif' alt='BRAND INTRODUCTION'  class='rollover'/></a></li>");
			}else{
				document.write("<li><a href='../FideliaLine/BrandIntroduction.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-5_off.gif' alt='BRAND INTRODUCTION'  class='rollover'/></a></li>");
			}
			if(num2==6){
				document.write("<li>");
				document.write("<a href='../FideliaLine/Introduction01-4.html'><img src='../images/common/lnb02-1-8_on.gif' alt='2013 1st COLLECTION'  class='rollover'/></a>");
				document.write("<ul class='depth3-1' style=''>");
					if(num3==16){
						document.write("<li><a href='../FideliaLine/Introduction01-4.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_on.gif' alt='introduction'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Introduction01-4.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
					}
					if(num3==17){
						document.write("<li><a href='../FideliaLine/Product01-4.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_on.gif' alt='product'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Product01-4.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
					}
				document.write("</ul>");
				document.write("</li>");
			}else{
				document.write("<li>");
				document.write("<a href='../FideliaLine/Introduction01-4.html'><img src='../images/common/lnb02-1-8_off.gif' alt='2013 1st COLLECTION'  class='rollover'/></a>");
				document.write("<ul class='depth3-1' style='display:none;'>");
				document.write("<li><a href='../FideliaLine/Introduction01-4.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
				document.write("<li><a href='../FideliaLine/Product01-4.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
				document.write("</ul>");
				document.write("</li>");
			}
			if(num2==7){
				document.write("<li>");
				document.write("<a href='../FideliaLine/Introduction01-5.html'><img src='../images/common/lnb02-1-9_on.gif' alt='2013 2nd COLLECTION'  class='rollover'/></a>");
				document.write("<ul class='depth3-1' style=''>");
					if(num3==18){
						document.write("<li><a href='../FideliaLine/Introduction01-5.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_on.gif' alt='introduction'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Introduction01-5.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
					}
					if(num3==19){
						document.write("<li><a href='../FideliaLine/Product01-5.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_on.gif' alt='product'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Product01-5.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
					}
				document.write("</ul>");
				document.write("</li>");
			}else{
				document.write("<li>");
				document.write("<a href='../FideliaLine/Introduction01-5.html'><img src='../images/common/lnb02-1-9_off.gif' alt='2013 2nd COLLECTION'  class='rollover'/></a>");
				document.write("<ul class='depth3-1' style='display:none;'>");
				document.write("<li><a href='../FideliaLine/Introduction01-5.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
				document.write("<li><a href='../FideliaLine/Product01-5.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
				document.write("</ul>");
				document.write("</li>");
			}
			if(num2==8){
				document.write("<li>");
				document.write("<a href='../FideliaLine/Introduction01-6.html'><img src='../images/common/lnb02-1-10_on.gif' alt='2013 3rd COLLECTION'  class='rollover'/></a>");
				document.write("<ul class='depth3-1' style=''>");
					if(num3==20){
						document.write("<li><a href='../FideliaLine/Introduction01-6.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_on.gif' alt='introduction'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Introduction01-6.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
					}
					if(num3==21){
						document.write("<li><a href='../FideliaLine/Product01-6.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_on.gif' alt='product'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Product01-6.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
					}
					if(num3==22){
						document.write("<li><a href='../FideliaLine/behind04.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-3_on.gif' alt='product'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/behind04.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-3_off.gif' alt='showcase'  class='rollover'/></a></li>");
					}
				document.write("</ul>");
				document.write("</li>");
			}else{
				document.write("<li>");
				document.write("<a href='../FideliaLine/Introduction01-6.html'><img src='../images/common/lnb02-1-10_off.gif' alt='2013 3rd COLLECTION'  class='rollover'/></a>");
				document.write("<ul class='depth3-1' style='display:none;'>");
				document.write("<li><a href='../FideliaLine/Introduction01-6.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
				document.write("<li><a href='../FideliaLine/Product01-6.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
				document.write("<li><a href='../FideliaLine/behind04.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-3_off.gif' alt='showcase'  class='rollover'/></a></li>");
				document.write("</ul>");
				document.write("</li>");
			}
			if(num2==3){
				document.write("<li>");
				document.write("<a href='../FideliaLine/Introduction01-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2_on.gif' alt='2012 1ST COLLECTION'  class='rollover'/></a>");
				document.write("<ul class='depth3-1' style=''>");
					if(num3==1){
						document.write("<li><a href='../FideliaLine/Introduction01-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_on.gif' alt='introduction'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Introduction01-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
					}
					if(num3==2){
						document.write("<li><a href='../FideliaLine/Product01-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_on.gif' alt='product'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Product01-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
					}
					if(num3==3){
						document.write("<li><a href='../FideliaLine/Showcase01-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-5_on.gif' alt='showcase'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Showcase01-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-5_off.gif' alt='showcase'  class='rollover'/></a></li>");
					}
				document.write("</ul>");
				document.write("</li>");
			}else{
				document.write("<li>");
				document.write("<a href='../FideliaLine/Introduction01-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2_off.gif' alt='2012 1ST COLLECTION'  class='rollover'/></a>");
				document.write("<ul class='depth3-1' style='display:none;'>");
				document.write("<li><a href='../FideliaLine/Introduction01-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
				document.write("<li><a href='../FideliaLine/Product01-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
				document.write("<li><a href='../FideliaLine/Showcase01-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-5_off.gif' alt='showcase'  class='rollover'/></a></li>");
				document.write("<!--li><a href='#none'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-4_off.gif' alt='Inspiration '  class='rollover'/></a></li-->");
				document.write("</ul>");
				document.write("</li>");
			}
			if(num2==4){
				document.write("<li>");
				document.write("<a href='../FideliaLine/Introduction01-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-3_on.gif' alt='2012 2ND COLLECTION'  class='rollover'/></a>");
				document.write("<ul class='depth3-1' style=''>");
					if(num3==4){
						document.write("<li><a href='../FideliaLine/Introduction01-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_on.gif' alt='introduction'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Introduction01-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
					}
					if(num3==5){
						document.write("<li><a href='../FideliaLine/Product01-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_on.gif' alt='product'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Product01-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
					}
					if(num3==6){
						document.write("<li><a href='../FideliaLine/Showcase01-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-3_on.gif' alt='showcase'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Showcase01-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-3_off.gif' alt='showcase'  class='rollover'/></a></li>");
					}
				document.write("</ul>");
				document.write("</li>");
			}else{
				document.write("<li>");
				document.write("<a href='../FideliaLine/Introduction01-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-3_off.gif' alt='2012 2ND COLLECTION'  class='rollover'/></a>");
				document.write("<ul class='depth3-1' style='display:none;'>");
				document.write("<li><a href='../FideliaLine/Introduction01-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
				document.write("<li><a href='../FideliaLine/Product01-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
				document.write("<li><a href='../FideliaLine/Showcase01-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-3_off.gif' alt='showcase'  class='rollover'/></a></li>");
				document.write("<!--li><a href='#none'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-4_off.gif' alt='Inspiration '  class='rollover'/></a></li-->");
				document.write("</ul>");
				document.write("</li>");
			}
			if(num2==5){
				document.write("<li>");
				document.write("<a href='../FideliaLine/Introduction01-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-4_on.gif' alt='2012 3RD COLLECTION'  class='rollover'/></a>");
				document.write("<ul class='depth3-1' style=''>");
					if(num3==7){
						document.write("<li><a href='../FideliaLine/Introduction01-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_on.gif' alt='introduction'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Introduction01-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
					}
					if(num3==8){
						document.write("<li><a href='../FideliaLine/Product01-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_on.gif' alt='product'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Product01-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
					}
					if(num3==9){
						document.write("<li><a href='../FideliaLine/Showcase01-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-3_on.gif' alt='showcase'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Showcase01-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-3_off.gif' alt='showcase'  class='rollover'/></a></li>");
					}
				document.write("</ul>");
				document.write("</li>");
			}else{
				document.write("<li>");
				document.write("<a href='../FideliaLine/Introduction01-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-4_off.gif' alt='2012 3RD COLLECTION'  class='rollover'/></a>");
				document.write("<ul class='depth3-1' style='display:none;'>");
				document.write("<li><a href='../FideliaLine/Introduction01-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
				document.write("<li><a href='../FideliaLine/Product01-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
				document.write("<li><a href='../FideliaLine/Showcase01-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-3_off.gif' alt='showcase'  class='rollover'/></a></li>");
				document.write("</ul>");
				document.write("</li>");
			}
		document.write("</ul>");
		document.write("</li>");


	}else{
		document.write("<a href='../FideliaLine/DesignerIntroduction01.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1_on.gif' alt='VERA WANG FOR FIDELIA'  class='rollover'/></a>");
		document.write("<ul class='depth2' style=''>");
		document.write("<li><a href='../FideliaLine/DesignerIntroduction01.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-1_off.gif' alt='DESIGNER INTRODUCTION'  class='rollover'/></a></li>");
		document.write("<li><a href='../FideliaLine/BrandIntroduction.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-5_off.gif' alt='BRAND INTRODUCTION'  class='rollover'/></a></li>");
		document.write("<li>");
		document.write("<a href='../FideliaLine/Introduction01-4.html'><img src='../images/common/lnb02-1-8_off.gif' alt='2013 s/s COLLECTION_1st'  class='rollover'/></a>");
		document.write("</li>");
		document.write("<li>");
		document.write("<a href='../FideliaLine/Introduction01-5.html'><img src='../images/common/lnb02-1-9_off.gif' alt='2013 s/s COLLECTION_2nd'  class='rollover'/></a>");
		document.write("</li>");
		document.write("<li>");
		document.write("<a href='../FideliaLine/Introduction01-6.html'><img src='../images/common/lnb02-1-10_off.gif' alt='2013 s/s COLLECTION_3rd'  class='rollover'/></a>");
		document.write("</li>");
		document.write("<li>");
		document.write("<a href='../FideliaLine/Introduction01-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2_off.gif' alt='2012 1ST COLLECTION'  class='rollover'/></a>");
		document.write("<ul class='depth3-1' style='display:none;'>");
		document.write("<li><a href='../FideliaLine/Introduction01-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
		document.write("<li><a href='../FideliaLine/Product01-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
		document.write("<li><a href='../FideliaLine/Showcase01-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-3_off.gif' alt='showcase'  class='rollover'/></a></li>");
		document.write("</ul>");
		document.write("</li>");
		document.write("<li>");
		document.write("<a href='../FideliaLine/Introduction01-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-3_off.gif' alt='2012 2ND COLLECTION'  class='rollover'/></a>");
		document.write("<ul class='depth3-1' style='display:none;'>");
		document.write("<li><a href='../FideliaLine/Introduction01-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
		document.write("<li><a href='../FideliaLine/Product01-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
		document.write("<li><a href='../FideliaLine/Showcase01-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-3_off.gif' alt='showcase'  class='rollover'/></a></li>");
		document.write("</ul>");
		document.write("</li>");
		document.write("<li>");
		document.write("<a href='../FideliaLine/Introduction01-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-4_off.gif' alt='2012 3RD COLLECTION'  class='rollover'/></a>");
		document.write("<ul class='depth3-1' style='display:none;'>");
		document.write("<li><a href='../FideliaLine/Introduction01-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
		document.write("<li><a href='../FideliaLine/Product01-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
		document.write("<li><a href='../FideliaLine/Showcase01-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-3_off.gif' alt='showcase'  class='rollover'/></a></li>");
		document.write("</ul>");
		document.write("</li>");
		document.write("</ul>");
		document.write("</li>");
	}

	if(num1==2){
	document.write("<li>");
	document.write("<a href='../FideliaLine/DesignerIntroduction02.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-2_on.gif' alt='FIDELIA BY CILIA BO¬§S'  class='rollover'/></a>");
	document.write("<ul class='depth2' style=''>");
			if(num2==6){
				document.write("<li><a href='../FideliaLine/DesignerIntroduction02.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-1_on.gif' alt='DESIGNER INTRODUCTION'  class='rollover'/></a></li>");
			}else{
				document.write("<li><a href='../FideliaLine/DesignerIntroduction02.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-1_off.gif' alt='DESIGNER INTRODUCTION'  class='rollover'/></a></li>");
			}
			if(num2==9){
				document.write("<li>");
				document.write("<a href='../FideliaLine/Introduction02-3.html'><img src='../images/common/lnb02-1-11_on.gif' alt='2013 s/s COLLECTION'  class='rollover'/></a>");
				document.write("<ul class='depth3-1' style=''>");
					if(num3==16){
						document.write("<li><a href='../FideliaLine/Introduction02-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_on.gif' alt='introduction'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Introduction02-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
					}
					if(num3==17){
						document.write("<li><a href='../FideliaLine/inspiration.html'><img src='../images/common/lnb02-2-2_on.gif' alt='inspiration'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/inspiration.html'><img src='../images/common/lnb02-2-2_off.gif' alt='inspiration'  class='rollover'/></a></li>");
					}
					if(num3==18){
						document.write("<li><a href='../FideliaLine/Product02-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_on.gif' alt='product'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Product02-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
					}
				document.write("</ul>");
				document.write("</li>");
			}else{
				document.write("<li>");
				document.write("<a href='../FideliaLine/Introduction02-3.html'><img src='../images/common/lnb02-1-11_off.gif' alt='2013 s/s COLLECTION'  class='rollover'/></a>");
				document.write("<ul class='depth3-1' style='display:none;'>");
				document.write("<li><a href='../FideliaLine/Introduction02-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
				document.write("<li><a href='../FideliaLine/inspiration.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-2-2_off.gif' alt='inspiration'  class='rollover'/></a></li>");
				document.write("<li><a href='../FideliaLine/Product02-3.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
				document.write("</ul>");
				document.write("</li>");
			}
			if(num2==7){
				document.write("<li>");
				document.write("<a href='../FideliaLine/Introduction02-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2_on.gif' alt='2012 1ST COLLECTION'  class='rollover'/></a>");
				document.write("<ul class='depth3-1' style=''>");
					if(num3==10){
						document.write("<li><a href='../FideliaLine/Introduction02-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_on.gif' alt='introduction'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Introduction02-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
					}
					if(num3==11){
						document.write("<li><a href='../FideliaLine/Product02-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_on.gif' alt='product'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Product02-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
					}
					if(num3==12){
						document.write("<li><a href='../FideliaLine/Illustration.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-2-1_on.gif' alt='illustration'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Illustration.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-2-1_off.gif' alt='illustration'  class='rollover'/></a></li>");
					}
				document.write("</ul>");
				document.write("</li>");
			}else{
				document.write("<li>");
				document.write("<a href='../FideliaLine/Introduction02-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2_off.gif' alt='2012 1ST COLLECTION'  class='rollover'/></a>");
				document.write("<ul class='depth3-1' style='display:none;'>");
				document.write("<li><a href='../FideliaLine/Introduction02-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
				document.write("<li><a href='../FideliaLine/Product02-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
				document.write("<li><a href='../FideliaLine/Illustration.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-2-1_on.gif' alt='illustration'  class='rollover'/></a></li>");
				document.write("<!--li><a href='#none'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-4_off.gif' alt='Inspiration '  class='rollover'/></a></li-->");
				document.write("</ul>");
				document.write("</li>");
			}
			if(num2==8){
				document.write("<li>");
				document.write("<a href='../FideliaLine/Introduction02-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-3_on.gif' alt='2012 2ND COLLECTION'  class='rollover'/></a>");
				document.write("<ul class='depth3-1' style=''>");
					if(num3==13){
						document.write("<li><a href='../FideliaLine/Introduction02-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_on.gif' alt='introduction'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Introduction02-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
					}
					if(num3==14){
						document.write("<li><a href='../FideliaLine/Product02-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_on.gif' alt='product'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Product02-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
					}
					if(num3==15){
						document.write("<li><a href='../FideliaLine/Illustration02.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-2-1_on.gif' alt='illustration'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaLine/Illustration02.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-2-1_off.gif' alt='illustration'  class='rollover'/></a></li>");
					}
			}else{
				document.write("<li>");
				document.write("<a href='../FideliaLine/Introduction02-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-3_off.gif' alt='2012 2ND COLLECTION'  class='rollover'/></a>");
				document.write("<ul class='depth3-1' style='display:none;'>");
				document.write("<li><a href='../FideliaLine/Introduction02-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
				document.write("<li><a href='../FideliaLine/Product02-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
				document.write("<!--li><a href='#none'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-2-1_off.gif' alt='illustration '  class='rollover'/></a></li-->");
				document.write("</ul>");
				document.write("</li>");
			}
		document.write("</ul>");
		document.write("</li>");
		document.write("</ul>");
		document.write("</nav>");
	}else{
		document.write("<li>");
		document.write("<a href='../FideliaLine/DesignerIntroduction02.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-2_on.gif' alt='FIDELIA BY CILIA BO¬§S'  class='rollover'/></a>");
		document.write("<ul class='depth2' style=''>");
		document.write("<li><a href='../FideliaLine/DesignerIntroduction02.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-1_off.gif' alt='DESIGNER INTRODUCTION'  class='rollover'/></a></li>");
		document.write("<li>");
		document.write("<a href='../FideliaLine/Introduction02-3.html'><img src='../images/common/lnb02-1-11_off.gif' alt='2013 s/s COLLECTION'  class='rollover'/></a>");
		document.write("</li>");
		document.write("<li>");
		document.write("<a href='../FideliaLine/Introduction02-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2_off.gif' alt='2012 1ST COLLECTION'  class='rollover'/></a>");
		document.write("<ul class='depth3-1' style='display:none;'>");
		document.write("<li><a href='../FideliaLine/Introduction02-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
		document.write("<li><a href='../FideliaLine/Product02-1.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
		document.write("<li><a href='../FideliaLine/Illustration.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-2-1_on.gif' alt='illustration'  class='rollover'/></a></li>");
		document.write("</ul>");
		document.write("</li>");
		document.write("<li>");
		document.write("<a href='../FideliaLine/Introduction02-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-3_off.gif' alt='2012 2ND COLLECTION'  class='rollover'/></a>");
		document.write("<ul class='depth3-1' style='display:none;'>");
		document.write("<li><a href='../FideliaLine/Introduction02-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-1_off.gif' alt='introduction'  class='rollover'/></a></li>");
		document.write("<li><a href='../FideliaLine/Product02-2.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2-2_off.gif' alt='product'  class='rollover'/></a></li>");
		document.write("<li><a href='../FideliaLine/Illustration02.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-2-1_off.gif' alt='illustration '  class='rollover'/></a></li>");
		document.write("</ul>");
		document.write("</li>");
		document.write("</ul>");
		document.write("</li>");
		document.write("</ul>");
		document.write("</nav>");
	}
}

function lnbMenu03 (num1,num2){
	document.write("<h2><img src='http://image.cjmall.com/fidelia/images/pr/h2_fideliapr.gif' alt='FIDELIA PR'/></h2>");
	document.write("<nav class='lnb'>");
	document.write("<ul>");
	document.write("<li>");
	if(num1==1){
		document.write("<a href='../FideliaPR/AD.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb03-1_on.gif' alt='AD' class='rollover'/></a>");
		document.write("<ul class='depth2'>");
			if(num2==1){
				document.write("<li><a href='../FideliaPR/AD.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb03-1-1_on.gif' alt='PRINT AD'  class='rollover'/></a></li>");
			}else{
				document.write("<li><a href='../FideliaPR/AD.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb03-1-1_off.gif' alt='PRINT AD'  class='rollover'/></a></li>");
			}
	}else{
		document.write("<a href='../FideliaPR/AD.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb03-1_off.gif' alt='AD' class='rollover'/></a>");
		document.write("<ul class='depth2' style='display:none;'>");
		document.write("<li><a href='../FideliaPR/AD.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb03-1-1_off.gif' alt='PRINT AD'  class='rollover'/></a></li>");
	}
	document.write("</ul>");
	document.write("</li>");
	if(num1==2){
		document.write("<li><a href='../FideliaPR/Movie.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb03-2_on.gif' alt='MEDIA' class='rollover' /></a></li>");
		document.write("<ul class='depth2'>");
			if(num2==2){
				document.write("<li><a href='../FideliaPR/Movie.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb03-2-1_on.gif' alt='Movie'  class='rollover'/></a></li>");
			}else{
				document.write("<li><a href='../FideliaPR/Movie.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb03-2-1_off.gif' alt='Movie'  class='rollover'/></a></li>");
			}
			if(num2==3){
				document.write("<li><a href='../FideliaPR/Drama.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb03-2-2_on.gif' alt='Drama'  class='rollover'/></a></li>");
			}else{
				document.write("<li><a href='../FideliaPR/Drama.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb03-2-2_off.gif' alt='Drama'  class='rollover'/></a></li>");
			}

	}else{
		document.write("<li><a href='../FideliaPR/Movie.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb03-2_off.gif' alt='MEDIA' class='rollover' /></a></li>");
		document.write("<ul class='depth2' style='display:none;'>");
		document.write("<li><a href='../FideliaPR/Movie.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb03-2-1_off.gif' alt='Movie'  class='rollover'/></a></li>");
		document.write("<li><a href='../FideliaPR/Drama.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb03-2-2_off.gif' alt='Drama'  class='rollover'/></a></li>");
	}
	document.write("</ul>");
	document.write("</li>");
	if(num1==3){
		document.write("<li><a href='../FideliaPR/Press.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb03-3_on.gif' alt='PRESS' class='rollover' /></a></li>");
	}else{
		document.write("<li><a href='../FideliaPR/Press.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb03-3_off.gif' alt='PRESS' class='rollover' /></a></li>");
	}
	document.write("</ul>");
	document.write("</nav>");
}

function lnbMenu04 (num1,num2) {
	document.write("<h2><img src='http://image.cjmall.com/fidelia/images/common/h2_shop.gif' alt='FIDELIA SHOP' /></h2>");
	document.write("<nav class='lnb'>");
	document.write("<ul>");
	document.write("<li>");
	if(num1==1){
		document.write("<a href='../FideliaShop/VERAWANG_1st_02.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb04-1_on.gif' alt='VERA WANG  FOR FIDELIA'  class='rollover'/></a>");
		document.write("<ul class='depth2' style=''>");
			if(num2==6){
				document.write("<li><a href='../FideliaShop/VERAWANG_1st_02.html'><img src='../images/common/lnb02-1-8_on.gif' alt='2013 1st COLLECTION'  class='rollover'/></a></li>");
			}else{
				document.write("<li><a href='../FideliaShop/VERAWANG_1st_02.html'><img src='../images/common/lnb02-1-8_off.gif' alt='2013 1st COLLECTION'  class='rollover'/></a></li>");
			}
			if(num2==7){
				document.write("<li><a href='../FideliaShop/VERAWANG_2nd_02.html'><img src='../images/common/lnb02-1-9_on.gif' alt='2013 2nd COLLECTION'  class='rollover'/></a></li>");
			}else{
				document.write("<li><a href='../FideliaShop/VERAWANG_2nd_02.html'><img src='../images/common/lnb02-1-9_off.gif' alt='2013 2nd COLLECTION'  class='rollover'/></a></li>");
			}
			if(num2==8){
				document.write("<li><a href='../FideliaShop/VERAWANG_3rd_02.html'><img src='../images/common/lnb02-1-10_on.gif' alt='2013 3rd COLLECTION'  class='rollover'/></a></li>");
			}else{
				document.write("<li><a href='../FideliaShop/VERAWANG_3rd_02.html'><img src='../images/common/lnb02-1-10_off.gif' alt='2013 3rd COLLECTION'  class='rollover'/></a></li>");
			}

			if(num2==1){
				document.write("<li><a href='../FideliaShop/VERAWANG_1st.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2_on.gif' alt='2012 1st '  class='rollover'/></a></li>");
			}else{
				document.write("<li><a href='../FideliaShop/VERAWANG_1st.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2_off.gif' alt='2012 1st '  class='rollover'/></a></li>");
			}
			if(num2==2){
				document.write("<li><a href='../FideliaShop/VERAWANG_2nd.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-3_on.gif' alt='2012 2nd '  class='rollover'/></a></li>");
			}else{
				document.write("<li><a href='../FideliaShop/VERAWANG_2nd.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-3_off.gif' alt='2012 2nd '  class='rollover'/></a></li>");
			}
			if(num2==3){
				document.write("<li><a href='../FideliaShop/VERAWANG_3rd.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-4_on.gif' alt='2012 3rd'  class='rollover'/></a></li>");
			}else{
				document.write("<li><a href='../FideliaShop/VERAWANG_3rd.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-4_off.gif' alt='2012 3rd'  class='rollover'/></a></li>");
			}
		document.write("</ul>");
		document.write("</li>");

	}else{
	document.write("<li>");
	document.write("<a href='../FideliaShop/VERAWANG_1st_02.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb04-1_on.gif' alt='VERA WANG  FOR FIDELIA'  class='rollover'/></a>");
	document.write("<ul class='depth2' style=''>");
	document.write("<li><a href='../FideliaShop/VERAWANG_1st_02.html'><img src='../images/common/lnb02-1-8_off.gif' alt='2013 1st COLLECTION'  class='rollover'/></a></li>");
	document.write("<li><a href='../FideliaShop/VERAWANG_2nd_02.html'><img src='../images/common/lnb02-1-9_off.gif' alt='2013 2nd COLLECTION'  class='rollover'/></a></li>");
	document.write("<li><a href='../FideliaShop/VERAWANG_3rd_02.html'><img src='../images/common/lnb02-1-10_off.gif' alt='2013 3rd COLLECTION'  class='rollover'/></a></li>");
	document.write("<li><a href='../FideliaShop/VERAWANG_1st.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-2_off.gif' alt='2012 1st '  class='rollover'/></a></li>");
	document.write("<li><a href='../FideliaShop/VERAWANG_2nd.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-3_off.gif' alt='2012 2nd '  class='rollover'/></a></li>");
	document.write("<li><a href='../FideliaShop/VERAWANG_3rd.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-4_off.gif' alt='2012 3rd'  class='rollover'/></a></li>");
	document.write("</ul>");
	document.write("</li>");

	}

	if(num1==2){
		document.write("<li>");
		document.write("<a href='../FideliaShop/CILIABOES_2013.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb04-2_on.gif' alt='FIDELIA BY CILIA BOES'  class='rollover'/></a>");
		document.write("<ul class='depth2'>");
			if(num2==9){
				document.write("<li><a href='../FideliaShop/CILIABOES_2013.html'><img src='../images/common/lnb02-1-11_on.gif' alt='2013 s/s COLLECTION'  class='rollover'/></a></li>");
			}else{
				document.write("<li><a href='../FideliaShop/CILIABOES_2013.html'><img src='../images/common/lnb02-1-11_off.gif' alt='2013 s/s COLLECTION'  class='rollover'/></a></li>");
			}

			if(num2==4){
				document.write("<li><a href='../FideliaShop/CILIABOES_1st.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-6_on.gif' alt='2012 1st '  class='rollover'/></a></li>");
			}else{
				document.write("<li><a href='../FideliaShop/CILIABOES_1st.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-6_off.gif' alt='2012 1st '  class='rollover'/></a></li>");
			}
			if(num2==5){
				document.write("<li><a href='../FideliaShop/CILIABOES_2nd.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-7_on.gif' alt='2012 2nd '  class='rollover'/></a></li>");
			}else{
				document.write("<li><a href='../FideliaShop/CILIABOES_2nd.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-7_off.gif' alt='2012 2nd '  class='rollover'/></a></li>");
			}
		document.write("</ul>");
		document.write("</li>");
	}else{
	document.write("<li>");
	document.write("<a href='../FideliaShop/CILIABOES_2013.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb04-2_on.gif' alt='FIDELIA BY CILIA BOES'  class='rollover'/></a>");
	document.write("<ul class='depth2' style=''>");
	document.write("<li><a href='../FideliaShop/CILIABOES_2013.html'><img src='../images/common/lnb02-1-11_off.gif' alt='2013 s/s COLLECTION'  class='rollover'/></a></li>");
	document.write("<li><a href='../FideliaShop/CILIABOES_1st.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-6_off.gif' alt='2012 1st '  class='rollover'/></a></li>");
	document.write("<li><a href='../FideliaShop/CILIABOES_2nd.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb02-1-7_off.gif' alt='2012 2nd '  class='rollover'/></a></li>");
	document.write("</ul>");
	document.write("</li>");
	}

	//if(num1==3){
	//	document.write("<li><a href='../FideliaShop/SeasonProduct.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb04-3_on.gif' alt='FIDELIA SEASON PRODUCT'  class='rollover'/></a></li>");
	//}else{
	//	document.write("<li><a href='../FideliaShop/SeasonProduct.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb04-3_off.gif' alt='FIDELIA SEASON PRODUCT'  class='rollover'/></a></li>");
	//}
	document.write("</ul>");
	document.write("</nav>");
}


function lnbMenu05 (num1,num2,num3) {
	document.write("<h2><img src='http://image.cjmall.com/fidelia/images/collection/h2_collection.gif' alt='FIDELIA COLLECTION' /></h2>");
	document.write("<nav class='lnb'>");
	document.write("<ul>");
	document.write("<li>");
	if(num1==1){
		document.write("<a href='../FideliaCollection/Video.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-1_on.gif' alt=VIDEO'  class='rollover'/></a>");
		//document.write("<ul class='depth2' style=''>");
			//if(num2==1){
			//	document.write("<li><a href='../FideliaCollection/Video.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-1-1_on.gif' alt='SHOWCASE MOVIE'  class='rollover'/></a></li>");
			//}else{
				//document.write("<li><a href='../FideliaCollection/Video.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-1-1_off.gif' alt='SHOWCASE MOVIE'  class='rollover'/></a></li>");
			//}
		//document.write("</ul>");
		document.write("</li>");
	}else{
		document.write("<a href='../FideliaCollection/Video.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-1_off.gif' alt='MOVIE'  class='rollover'/></a>");
		//document.write("<ul class='depth2' style='display:none;'>");
		//document.write("<li><a href='../FideliaCollection/Video.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-1-1_off.gif' alt='SHOWCASE MOVIE'  class='rollover'/></a></li>");
		//document.write("</ul>");
		document.write("</li>");
	}

	document.write("<li>");
	if(num1==2){
		document.write("<a href='../FideliaCollection/Catalogue-VERAWANG_ss_1st.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2_on.gif' alt='CATALOGUE'  class='rollover'/></a>");
		document.write("<ul class='depth2' style=''>");
			if(num2==3){
				document.write("<li>");
				document.write("<a href='../FideliaCollection/Catalogue-VERAWANG_ss_1st.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-1_on.gif' alt='VERA WANG FOR FIDELIA'  class='rollover'/></a>");
				document.write("<ul class='depth3 depth3-2' style=''>");
					if(num3==5){
						document.write("<li><a href='../FideliaCollection/Catalogue-VERAWANG_ss_1st.html'><img src='../images/common/lnb05-2-1-4_on.gif' alt='2012 1ST COLLECTION'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaCollection/Catalogue-VERAWANG_ss_1st.html'><img src='../images/common/lnb05-2-1-4_off.gif' alt='2012 1ST COLLECTION'  class='rollover'/></a></li>");
					}
					if(num3==6){
						document.write("<li><a href='../FideliaCollection/Catalogue-VERAWANG_ss_2nd.html'><img src='../images/common/lnb05-2-1-5_on.gif' alt='2012 1ST COLLECTION'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaCollection/Catalogue-VERAWANG_ss_2nd.html'><img src='../images/common/lnb05-2-1-5_off.gif' alt='2012 1ST COLLECTION'  class='rollover'/></a></li>");
					}
					if(num3==7){
						document.write("<li><a href='../FideliaCollection/Catalogue-VERAWANG_ss_3rd.html'><img src='../images/common/lnb05-2-1-6_on.gif' alt='2012 1ST COLLECTION'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaCollection/Catalogue-VERAWANG_ss_3rd.html'><img src='../images/common/lnb05-2-1-6_off.gif' alt='2012 1ST COLLECTION'  class='rollover'/></a></li>");
					}
					if(num3==1){
						document.write("<li><a href='../FideliaCollection/Catalogue-VERAWANG1st.html'><img src='../images/common/lnb05-2-1-1_on.gif' alt='2012 1ST COLLECTION'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaCollection/Catalogue-VERAWANG1st.html'><img src='../images/common/lnb05-2-1-1_off.gif' alt='2012 1ST COLLECTION'  class='rollover'/></a></li>");
					}
					if(num3==2){
						document.write("<li><a href='../FideliaCollection/Catalogue-VERAWANG2nd.html'><img src='../images/common/lnb05-2-1-2_on.gif' alt='2012 2ND COLLECTION'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaCollection/Catalogue-VERAWANG2nd.html'><img src='../images/common/lnb05-2-1-2_off.gif' alt='2012 2ND COLLECTION'  class='rollover'/></a></li>");
					}
					if(num3==3){
						document.write("<li><a href='../FideliaCollection/Catalogue-VERAWANG3rd.html'><img src='../images/common/lnb05-2-1-3_on.gif' alt='2012 3RD COLLECTION'  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaCollection/Catalogue-VERAWANG3rd.html'><img src='../images/common/lnb05-2-1-3_off.gif' alt='2012 3RD COLLECTION'  class='rollover'/></a></li>");
					}
				document.write("</ul>");
				document.write("</li>");
			}else{
				document.write("<li>");
				document.write("<a href='../FideliaCollection/Catalogue-VERAWANG1st.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-1_off.gif' alt='VERA WANG FOR FIDELIA'  class='rollover'/></a>");
				document.write("<ul class='depth3' style='display:none;'>");
				document.write("<li><a href='../FideliaCollection/Catalogue-VERAWANG1st.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-1-1_off.gif' alt='2012 1ST COLLECTION'  class='rollover'/></a></li>");
				document.write("<li><a href='../FideliaCollection/Catalogue-VERAWANG2nd.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-1-2_off.gif' alt='2012 2ND COLLECTION'  class='rollover'/></a></li>");
				document.write("<li><a href='../FideliaCollection/Catalogue-VERAWANG3rd.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-1-3_off.gif' alt='2012 3RD COLLECTION'  class='rollover'/></a></li>");
				document.write("</ul>");
				document.write("</li>");
			}
			if(num2==4){
				document.write("<li>");
				document.write("<a href='../FideliaCollection/Catalogue-CILIABOES2013.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-2_on.gif' alt='FIDELIA BY CILIA BO¬§S'  class='rollover'/></a>");
				document.write("<ul class='depth3 depth3-2' style=''>");
					if(num3==8){
						document.write("<li><a href='../FideliaCollection/Catalogue-CILIABOES2013.html'><img src='../images/common/lnb05-2-2-3_on.gif' alt=''  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaCollection/Catalogue-CILIABOES2013.html'><img src='../images/common/lnb05-2-2-3_off.gif' alt=''  class='rollover'/></a></li>");
					}
					if(num3==4){
						document.write("<li><a href='../FideliaCollection/Catalogue-CILIABOES1st.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-2-1_on.gif' alt=''  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaCollection/Catalogue-CILIABOES1st.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-2-1_off.gif' alt=''  class='rollover'/></a></li>");
					}
					if(num3==5){
						document.write("<li><a href='../FideliaCollection/Catalogue-CILIABOES2nd.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-2-2_on.gif' alt=''  class='rollover'/></a></li>");
					}else{
						document.write("<li><a href='../FideliaCollection/Catalogue-CILIABOES2nd.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-2-2_off.gif' alt=''  class='rollover'/></a></li>");
					}
				document.write("</ul>");
				document.write("</li>");
			}else{
				document.write("<li>");
				document.write("<a href='../FideliaCollection/Catalogue-CILIABOES1st.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-2_off.gif' alt='FIDELIA BY CILIA BO¬§S'  class='rollover'/></a>");
				document.write("<ul class='depth3' style='display:none;'>");
				document.write("<li><a href='../FideliaCollection/Catalogue-CILIABOES1st.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-2-1_off.gif' alt='LIFTING SECRET NOWIRE'  class='rollover'/></a></li>");
				document.write("<li><a href='../FideliaCollection/Catalogue-CILIABOES2nd.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-2-2_off.gif' alt='LIFTING SECRET NOWIRE'  class='rollover'/></a></li>");
				document.write("</ul>");
				document.write("</li>");
			}
		document.write("</ul>");
		document.write("</li>");
	}else{
		document.write("<a href='../FideliaCollection/Catalogue-VERAWANG1st.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2_off.gif' alt='CATALOGUE'  class='rollover'/></a>");
		document.write("<ul class='depth2' style='display:none;'>");
		document.write("<li>");
		document.write("<a href='../FideliaCollection/Catalogue-VERAWANG1st.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-1_off.gif' alt='VERA WANG FOR FIDELIA'  class='rollover'/></a>");
		document.write("<ul class='depth3' style='display:none;'>");
		document.write("<li><a href='../FideliaCollection/Catalogue-VERAWANG1st.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-1-1_off.gif' alt='2012 1ST COLLECTION'  class='rollover'/></a></li>");
		document.write("<li><a href='../FideliaCollection/Catalogue-VERAWANG2nd.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-1-2_off.gif' alt='2012 2ND COLLECTION'  class='rollover'/></a></li>");
		document.write("<li><a href='../FideliaCollection/Catalogue-VERAWANG3rd.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-1-3_off.gif' alt='2012 3RD COLLECTION'  class='rollover'/></a></li>");
		document.write("</ul>");
		document.write("</li>");
		document.write("<li>");
		document.write("<a href='../FideliaCollection/Catalogue-CILIABOES1st.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-2_off.gif' alt='FIDELIA BY CILIA BO¬§S'  class='rollover'/></a>");
		document.write("<ul class='depth3' style='display:none;'>");
		document.write("<li><a href='../FideliaCollection/Catalogue-CILIABOES1st.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-2-1_off.gif' alt='LIFTING SECRET NOWIRE'  class='rollover'/></a></li>");
		document.write("<li><a href='../FideliaCollection/Catalogue-CILIABOES2nd.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-2-2-2_off.gif' alt='LIFTING SECRET NOWIRE'  class='rollover'/></a></li>");
		document.write("</ul>");
		document.write("</li>");
		document.write("</ul>");
		document.write("</li>");
	}

	document.write("<li>");
	if(num1==3){
		document.write("<a href='../FideliaCollection/ModeCityParis02.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-3_on.gif' alt='MODE CITY PARIS'  class='rollover'/></a>");
		document.write("<ul class='depth2' style=''>");
			if(num2==5){
				document.write("<li><a href='../FideliaCollection/ModeCityParis02.html'><img src='../images/common/lnb05-3-2_on.gif' alt='2013.1'  class='rollover'/></a></li>");
			}else{
				document.write("<li><a href='../FideliaCollection/ModeCityParis02.html'><img src='../images/common/lnb05-3-2_off.gif' alt='2013.1'  class='rollover'/></a></li>");
			}
			if(num2==4){
				document.write("<li><a href='../FideliaCollection/ModeCityParis.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-3-1_on.gif' alt='2012.7'  class='rollover'/></a></li>");
			}else{
				document.write("<li><a href='../FideliaCollection/ModeCityParis.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-3-1_off.gif' alt='2012.7'  class='rollover'/></a></li>");
			}
		document.write("</ul>");
		document.write("</li>");
		document.write("</ul>");
	}else{
		document.write("<a href='../FideliaCollection/ModeCityParis02.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-3_off.gif' alt='MODE CITY PARIS'  class='rollover'/></a>");
		document.write("<ul class='depth2' style='display:none;'>");
		document.write("<li><a href='../FideliaCollection/ModeCityParis02.html'><img src='../images/common/lnb05-3-2_off.gif' alt='2013.1'  class='rollover'/></a></li>");
		document.write("<li><a href='../FideliaCollection/ModeCityParis.html'><img src='http://image.cjmall.com/fidelia/images/common/lnb05-3-1_off.gif' alt='2012.7'  class='rollover'/></a></li>");
		document.write("</ul>");
		document.write("</li>");
		document.write("</ul>");
	}
}
document.write("</nav>");

