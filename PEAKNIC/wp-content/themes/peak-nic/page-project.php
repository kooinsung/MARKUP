<?php
    /**
    * Template Name: project
    */
?>

<?php get_header(); ?>
	<!-- content -->
	<div class="content">
		<div class="contact"> 
			<?php if ( have_posts()	) :	while (	have_posts() ) : the_post(); ?>
				<?php the_content(); ?>
			<?php endwhile;	else: ?>
				<div class="no_content">Sorry!</div>
			<?php endif; ?>
		</div>
	</div>
	<!-- //content -->
<?php get_footer(); ?>
<script>

</script>
