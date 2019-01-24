<?php
	// Thumbnails
	add_theme_support( 'post-thumbnails' );

	// Menus
	register_nav_menus( array(
		'menu' => 'menu'
	));

	remove_filter( 'the_content', 'wpautop' );
	remove_filter( 'the_excerpt', 'wpautop' );

	show_admin_bar( false );

	add_filter( 'wp_calculate_image_srcset', '__return_false' );

	function slide_widgets_init() {

	register_sidebar( array(
	'name'          => '슬라이더 영역',
	'id'            => 'custom_widget_1',
	'before_widget' => '<div>',
	'after_widget'  => '</div>',
	'before_title'  => '<h2 class="rounded">',
	'after_title'   => '</h2>',
	) );

	}
	add_action( 'widgets_init', 'slide_widgets_init' );
?>








