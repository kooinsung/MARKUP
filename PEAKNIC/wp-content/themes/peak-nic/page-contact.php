<?php
    /**
    * Template Name: contact
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

 function initMap() {
	var myLatLng = {lat: 37.377515, lng: 127.114100};

	var map = new google.maps.Map(document.getElementById('maps'), {
	  center: myLatLng,
	  zoom: 17
	});

	var marker = new google.maps.Marker({
	  map: map,
	  position: myLatLng,
	  title: 'PEAKNIC'
	});
    google.maps.event.addDomListener(window, "resize", function() { //리사이즈에 따른 마커 위치
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center); 
    });
  }
</script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA_w-h1KxKxhpXPq-UEtd05oGB5j3bLStw&callback=initMap" async defer></script>