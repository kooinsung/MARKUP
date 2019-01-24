<!doctype html>
<html <?php	language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, width=device-width, minimal-ui">
	<meta name="format-detection" content="telephone=no">	
	<title><?php bloginfo('name'); ?> <?php	wp_title('|'); ?></title>
	<!--link rel="shortcut icon" href="" /-->
	<link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>?1">
	<script type="text/javascript" src="<?php bloginfo('template_url'); ?>/jquery-2.0.2.min.js"></script>
	<script type="text/javascript" src="<?php bloginfo('template_url'); ?>/jquery.plugin.js?12"></script>
	<script type="text/javascript" src="<?php bloginfo('template_url'); ?>/peak-nic.js?12"></script>
	<link rel="stylesheet" href='http://fonts.googleapis.com/css?family=Roboto:400,300,100,500,700'>

	<?php wp_head(); ?>
</head>
<body	<?php body_class();	?>>
<div id="wrap" class="wrap">
	<!-- header -->
	<header id="header" class="header">
		<div class="inner">
			<h1 class="logo"><a href="/">PEAKNIC</a></h1>
			<a href="" class="btn_menu"></a>
			<div class="menus">
				<div class="menu_ins">
					<?php
						wp_nav_menu( array(
							'theme_location' => 'menu',
							'fallback_cb' => false
						));
					?>

					<div class="sns">
						<ul>
							<li class="fb"><a href="https://www.facebook.com/peaknic.ux.design" target="_blank">facebook</a></li>
							<li class="be"><a href="https://www.behance.net/Peaknic" target="_blank">behance</a></li>
							<li class="ins"><a href="https://www.instagram.com/peaknic_/" target="_blank">instagrom</a></li>
						</ul>
					</div>
				</div>
				<button type="button" class="close">close</button>
			</div>
		</div>
	</header>
	<!-- //header -->