<?php get_header(); ?>
	<!-- content -->
	<div class="content">
		<div class="content_inner">
			<div class="project_lists">
				<ul>
					<?php if ( have_posts()	) :	while (	have_posts() ) : the_post(); ?>
					<li class="post_item">
						<a href="<?php the_permalink(); ?>" class="viewLink">
							<div class="thumb">
								<?php
									the_post_thumbnail('full');
								?>
							</div>
							<strong class="tit"><?php the_title(); ?></strong>
							<span class="cate">
								 <?php foreach((get_the_category()) as $category) { echo $category->cat_name . ' '; } ?>
							</span>
							<div class="client">
								<img src="<?php the_field('client'); ?>" /></div>
						</a>
					</li>
					<?php endwhile;	else: ?>
						<li class="no_content">sorry</li>
					<?php endif; ?>
				</ul>
			</div>
		</div>
	</div>
	<!-- //content -->
<?php get_footer(); ?>