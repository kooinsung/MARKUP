<?php
    /**
    * Template Name: about us
    */
?>
<?php get_header(); ?>
	<!-- content -->
	<div class="content template_content">
			<div class="about-us" id="about-us-pc">
				<?php if ( have_posts()	) :	while (	have_posts() ) : the_post(); ?>
					<?php the_content(); ?>
					<!--div id="fullpage">
						<div class="section " id="section0">
							<div class="slide about_section as1">
								<h2 class="h2">What we do</h2>
								<div class="about_txts">
									<p class="t1">
										PEAKNIC은 에이전시와 기업에서 수많은 프로젝트들로 다년간의 실무 경험과 전문화된 노하우를 갖춘<br>
										다수의 경력자들과 늘 함께합니다. 기업의 전략과 마인드를 깊이 이해하고 주어진 예산과 시간 내에서 최적의 대안을 마련하며<br>
										전략적 플래닝 과정에 파트너십을 갖고 참여하기를 기대합니다.
									</p>
									<p class="t2">
										피크닉은 스크린에 보여지는<br>
										모든 것을 창의적으로 기획하고 디자인하는<br>
										그룹입니다.
									</p>
								</div>
							</div>
							<div class="slide about_section as2">
								<h2 class="h2">Principle & Progress</h2>
								<div class="about_txts">
									<div class="steps">
										<ol>
											<li>
												<div class="ins">
													<strong class="num">1</strong>
													<p class="t1">OBSERVATION&<br>DEFINE</p>
													<p class="t2">
														피크닉의 전문가와<br>
														클라이언트의 종합적인 커뮤니케이션<br>
														기업 경영의 전반적인 상황의 면밀한 파악<br>
														문제의 명확한 분석과 정의
													</p>
												</div>
											</li>
											<li>
												<div class="ins">
													<strong class="num">2</strong>
													<p class="t1">RESEARCH &<br>ANALYSIS</p>
													<p class="t2">
														거시적/미시적 분석 BM model 분석<br>
														(Company / Competitor / Customer)<br>
														Segmentation / Targeting / <br>
														Positioning
													</p>
												</div>
											</li>
											<li>
												<div class="ins">
													<strong class="num">3</strong>
													<p class="t1">CONCEPT</p>
													<p class="t2">
														Brain storming / Synetics<br>
														Culture / Market / Lifestyle / <br>
														Tech / Design trend
													</p>
												</div>
											</li>
											<li>
												<div class="ins">
													<strong class="num">4</strong>
													<p class="t1">RAPID<br>PROTOTYPING &<br>PROPOSAL</p>
													<p class="t2">
														Style Proposal<br>
														Main screen design<br>
														UX Prototype<br>
														Simulation preview
													</p>
												</div>
											</li>
											<li>
												<div class="ins">
													<strong class="num">5</strong>
													<p class="t1">PRODUCTION &<br>IMPLEMENTATION</p>
													<p class="t2">
														최종적인 디자인 완성품을 위한 작업<br>
														General Component 구축<br>
														Interaction design guide<br>
														Basic guideline
													</p>
												</div>
											</li>
											<li>
												<div class="ins">
													<strong class="num">6</strong>
													<p class="t1">마케팅 평가 & 사후관리</p>
													<p class="t2">Follow-up</p>
												</div>
											</li>
										</ol>
									</div>
								</div>
							</div>

							<div class="slide about_section as3">
								<h2 class="h2">Clients</h2>
								<div class="about_txts">
									<p class="t1">
										PEAKNIC은 에이전시와 기업에서 수많은 프로젝트들로 다년간의 실무 경험과 전문화된 노하우를 갖춘<br>
										다수의 경력자들과 늘 함께합니다. 기업의 전략과 마인드를 깊이 이해하고 주어진 예산과 시간 내에서 최적의 대안을 마련하며<br>
										전략적 플래닝 과정에 파트너십을 갖고 참여하기를 기대합니다.
									</p>
									<ul class="client_list">
										<li><img src="http://peak-nic.com/wp/wp-content/uploads/2017/08/img_client2.png" alt=""></li>
										<li><img src="http://peak-nic.com/wp/wp-content/uploads/2017/08/img_client1.png" alt=""></li>
										<li><img src="http://peak-nic.com/wp/wp-content/uploads/2017/08/img_client3.png" alt=""></li>
										<li><img src="http://peak-nic.com/wp/wp-content/uploads/2017/08/img_client7.png" alt=""></li>
										<li><img src="http://peak-nic.com/wp/wp-content/uploads/2017/08/img_client5.png" alt=""></li>
										<li><img src="http://peak-nic.com/wp/wp-content/uploads/2017/08/img_client8.png" alt=""></li>
										<li><img src="http://peak-nic.com/wp/wp-content/uploads/img_client11.png" alt=""></li>
										<li><img src="http://peak-nic.com/wp/wp-content/uploads/2017/08/img_client4.png" alt=""></li>
										<li><img src="http://peak-nic.com/wp/wp-content/uploads/2017/08/img_client6.png" alt=""></li>
										<li><img src="http://peak-nic.com/wp/wp-content/uploads/img_client9.png" alt=""></li>
										<li><img src="http://peak-nic.com/wp/wp-content/uploads/img_client10.png" alt=""></li>
									</ul>
								</div>
							</div>

							<div class="slide about_section as4">
								<h2 class="h2">Who we are</h2>
								<div class="about_txts">
									<ul class="staff_list">
										<li>
											<span class="thumb"><img src="" alt=""></span>
											<p><strong>Sujeong<br> Paik</strong> <span>Managing director</span></p>
										</li>
										<li>
											<span class="thumb"><img src="" alt=""></span>
											<p><strong>Gaeun<br> cha</strong> <span>Design director</span></p>
										</li>
										<li>
											<span class="thumb"><img src="" alt=""></span>
											<p><strong>Semi<br> kim</strong> <span>Design director</span></p>
										</li>
										<li>
											<span class="thumb"><img src="" alt=""></span>
											<p><strong>Jinhee<br> ham</strong> <span>Design director</span></p>
										</li>
										<li>
											<span class="thumb"><img src="" alt=""></span>
											<p><strong>Jinhee<br> ham</strong> <span>Design director</span></p>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div class="custom_bts">
						<a href="" class="next">next</a>
						<a href="" class="prev">prev</a>
					</div-->
					<button type="button" class="top_move">top</button>
				<?php endwhile;	else: ?>
					<div class="no_content">Sorry!</div>
				<?php endif; ?>
			</div>
	</div>
	<!-- //content -->
<?php get_footer(); ?>