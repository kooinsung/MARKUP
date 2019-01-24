<?php get_header(); ?>
<div id="main">
  <div id="content">
    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
      <div class="jb-post-single">
        <h2>
          <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
        </h2>
        <p>
          <?php echo get_the_date(); ?> <?php echo get_the_time(); ?>
          | Category : <?php the_category(', '); ?>
        </p>
        <?php the_content(); ?>
        <?php comments_template(); ?> 
      </div>
    <?php endwhile; else: ?>
      <h2>Sorry!</h2>
    <?php endif; ?>
  </div>
</div>
<?php get_footer(); ?>