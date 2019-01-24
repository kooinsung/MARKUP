<?php get_header(); ?>
	<!-- content -->
	<div class="content">
		<div class="content_inner">
			<div class="project_views">
				<?php if ( have_posts()	) :	while (	have_posts() ) : the_post(); ?>
					<div class="views"><?php the_content(); ?> <button type="button" class="back" onclick="history.back();">back</button></div>
				<?php endwhile;	else: ?>
					<div class="no_content">Sorry!</div>
				<?php endif; ?>
			</div>
		</div>
	</div>
	<!-- //content -->
<?php get_footer(); ?>