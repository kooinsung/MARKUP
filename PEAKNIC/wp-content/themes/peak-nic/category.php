<?php get_header(); ?>
	<!-- content -->
	<div class="content">
		<div class="content_inner">
			<?php if ( have_posts()	) :	while (	have_posts() ) : the_post(); ?>
				<div class="views"><?php the_content(); ?></div>
			<?php endwhile;	else: ?>
				<div class="no_content">Sorry!</div>
			<?php endif; ?>
		</div>
	</div>
	<!-- //content -->
<?php get_footer(); ?>