$(window).load(function(){
	$('.loading').fadeOut('fast');
	$('.container').fadeIn('fast');
});
$('document').ready(function(){
	function alignBalloons(time) {
		var duration = (typeof time === 'number') ? time : 500;
		var winW = $(window).width();
		var vw = winW / 2;
		var balloons = ['#b11', '#b22', '#b33', '#b44', '#b55', '#b66', '#b77'];
		
		if ($('#b11').length === 0) return;

		if (winW <= 520) {
			// Mobile devices (Android, iPhone)
			var pad = 6;
			var availW = winW - (pad * 2);
			var balloonW = Math.max(36, Math.min(44, Math.floor((availW - 10) / 7)));
			var balloonH = Math.round(balloonW * 1.83);
			var spacing = Math.floor((availW - balloonW) / 6);
			var startLeft = pad;
			var topPos = 175; // Sits in the clear band between top photos (55-137px) and bottom photos (305-387px)

			$('.balloons').css({
				'width': balloonW + 'px',
				'height': balloonH + 'px',
				'background-size': balloonW + 'px ' + balloonH + 'px'
			});
			$('.balloons h2').css({
				'font-size': Math.round(balloonW * 0.52) + 'px',
				'line-height': '1',
				'margin': '0',
				'padding-top': '14%'
			});

			for (var i = 0; i < 7; i++) {
				$(balloons[i]).stop().animate({
					top: topPos,
					left: Math.round(startLeft + (i * spacing))
				}, duration);
			}
		} else if (winW <= 992) {
			// Tablets
			var balloonW = 60;
			var balloonH = Math.round(balloonW * 1.83);
			var spacing = Math.floor((winW - 60) / 7);
			var startLeft = Math.round((winW - (spacing * 6 + balloonW)) / 2);
			var topPos = 215; // Sits comfortably below banner

			$('.balloons').css({
				'width': balloonW + 'px',
				'height': balloonH + 'px',
				'background-size': balloonW + 'px ' + balloonH + 'px'
			});
			$('.balloons h2').css({
				'font-size': '30px',
				'line-height': '1',
				'margin': '0',
				'padding-top': '14%'
			});

			for (var i = 0; i < 7; i++) {
				$(balloons[i]).stop().animate({
					top: topPos,
					left: Math.round(startLeft + (i * spacing))
				}, duration);
			}
		} else {
			// Desktop & Laptop
			var balloonW = 75;
			var balloonH = Math.round(balloonW * 1.83);
			var spacing = 80;
			var totalW = spacing * 6 + balloonW;
			var startLeft = Math.round(vw - (totalW / 2));
			var topPos = 240; // Sits below top banner (ends ~180px) and above bottom photos (390px)

			$('.balloons').css({
				'width': balloonW + 'px',
				'height': balloonH + 'px',
				'background-size': balloonW + 'px ' + balloonH + 'px'
			});
			$('.balloons h2').css({
				'font-size': '38px',
				'line-height': '1',
				'margin': '0',
				'padding-top': '14%'
			});

			for (var i = 0; i < 7; i++) {
				$(balloons[i]).stop().animate({
					top: topPos,
					left: Math.round(startLeft + (i * spacing))
				}, duration);
			}
		}
	}

	$(window).resize(function(){
		alignBalloons(300);
	});

	$('#turn_on').click(function(){
		$('#bulb_yellow').addClass('bulb-glow-yellow');
		$('#bulb_red').addClass('bulb-glow-red');
		$('#bulb_blue').addClass('bulb-glow-blue');
		$('#bulb_green').addClass('bulb-glow-green');
		$('#bulb_pink').addClass('bulb-glow-pink');
		$('#bulb_orange').addClass('bulb-glow-orange');
		$('body').addClass('peach');
		$(this).fadeOut('slow').delay(5000).promise().done(function(){
			$('#play').fadeIn('slow');
		});
	});
	$('#play').click(function(){
		var audio = $('.song')[0];
        audio.play();
        $('#bulb_yellow').addClass('bulb-glow-yellow-after');
		$('#bulb_red').addClass('bulb-glow-red-after');
		$('#bulb_blue').addClass('bulb-glow-blue-after');
		$('#bulb_green').addClass('bulb-glow-green-after');
		$('#bulb_pink').addClass('bulb-glow-pink-after');
		$('#bulb_orange').addClass('bulb-glow-orange-after');
		$('body').css('backgroud-color','#FFF');
		$('body').addClass('peach-after');
		$(this).fadeOut('slow').delay(6000).promise().done(function(){
			$('#bannar_coming').fadeIn('slow');
		});
	});

	$('#bannar_coming').click(function(){
		$('.bannar').addClass('bannar-come');

		$(this).fadeOut('slow').delay(6000).promise().done(function(){
			$('#balloons_flying').fadeIn('slow');

		// Show the album photos
		$('.album-photo').fadeIn('slow');

		$('.can-zoom').fadeIn('slow');

		});
	});

	function getRandPos() {
		var winW = $(window).width();
		var winH = $(window).height();
		var maxL = Math.max(10, winW - 90);
		var maxT = Math.max(10, winH - 180);
		return {
			left: Math.max(5, Math.floor(maxL * Math.random())),
			bottom: Math.max(10, Math.floor(maxT * Math.random()))
		};
	}

	function loopOne() {
		var pos = getRandPos();
		$('#b1').animate({left:pos.left, bottom:pos.bottom}, 10000, function(){
			loopOne();
		});
	}
	function loopTwo() {
		var pos = getRandPos();
		$('#b2').animate({left:pos.left, bottom:pos.bottom}, 10000, function(){
			loopTwo();
		});
	}
	function loopThree() {
		var pos = getRandPos();
		$('#b3').animate({left:pos.left, bottom:pos.bottom}, 10000, function(){
			loopThree();
		});
	}
	function loopFour() {
		var pos = getRandPos();
		$('#b4').animate({left:pos.left, bottom:pos.bottom}, 10000, function(){
			loopFour();
		});
	}
	function loopFive() {
		var pos = getRandPos();
		$('#b5').animate({left:pos.left, bottom:pos.bottom}, 10000, function(){
			loopFive();
		});
	}

	function loopSix() {
		var pos = getRandPos();
		$('#b6').animate({left:pos.left, bottom:pos.bottom}, 10000, function(){
			loopSix();
		});
	}
	function loopSeven() {
		var pos = getRandPos();
		$('#b7').animate({left:pos.left, bottom:pos.bottom}, 10000, function(){
			loopSeven();
		});
	}

	$('#balloons_flying').click(function(){
		$('.balloon-border').animate({top:-500},8000);
		$('#b1,#b4,#b5,#b7').addClass('balloons-rotate-behaviour-one');
		$('#b2,#b3,#b6').addClass('balloons-rotate-behaviour-two');
		loopOne();
		loopTwo();
		loopThree();
		loopFour();
		loopFive();
		loopSix();
		loopSeven();

		$(this).fadeOut('slow').delay(5000).promise().done(function(){
			$('#cake_fadein').fadeIn('slow');
		});
	});	

	$('#cake_fadein').click(function(){
		$('.cake').fadeIn('slow');
		$(this).fadeOut('slow').delay(3000).promise().done(function(){
			$('#light_candle').fadeIn('slow');
		});
	});

	$('#light_candle').click(function(){
		$('.fuego').fadeIn('slow');
		$(this).fadeOut('slow').promise().done(function(){
			$('#wish_message').fadeIn('slow');
		});
	});

		
	$('#wish_message').click(function(){
		$('#b1,#b2,#b3,#b4,#b5,#b6,#b7').stop();
		$('#b1').attr('id','b11');
		$('#b2').attr('id','b22');
		$('#b3').attr('id','b33');
		$('#b4').attr('id','b44');
		$('#b5').attr('id','b55');
		$('#b6').attr('id','b66');
		$('#b7').attr('id','b77');
		alignBalloons(600);
		$('.balloons').css('opacity','0.9');
		$('.balloons h2').fadeIn(2500);
		$(this).fadeOut('slow').delay(2500).promise().done(function(){
			$('#story').fadeIn('slow');
		});
	});
	
	$('#story').click(function(){
		$(this).fadeOut('slow');
		$('.can-zoom').fadeOut('slow');
		$('.message').fadeIn('slow');

		var $messages = $(".message p");   // only inside .message
		var totalMessages = $messages.length;

		function msgLoop(i) {
			if (i < totalMessages - 1) {
				$messages.eq(i).fadeIn('slow').delay(1500).fadeOut('slow').promise().done(function(){
					msgLoop(i + 1);
				});
			} else {
				// Last message stays crowned above the cake
				$messages.eq(i).fadeIn('slow');
			}
		}

		msgLoop(0);
	});

});

// Zoom (lightbox) feature with 5-photo gallery
var galleryPhotos = [
    'assets/images/photo1.jpg',
    'assets/images/photo5.jpg',
    'assets/images/photo2.jpg',
    'assets/images/photo4.jpg',
    'assets/images/photo3.jpg'
];
var currentPhotoIndex = 0;

function showGalleryPhoto(index) {
    if (index < 0) index = galleryPhotos.length - 1;
    if (index >= galleryPhotos.length) index = 0;
    currentPhotoIndex = index;
    $('#lightbox-img').attr('src', galleryPhotos[currentPhotoIndex]);
    $('#lightbox-counter').text((currentPhotoIndex + 1) + ' / ' + galleryPhotos.length);
}

$(document).on('click', '.album-photo', function(e) {
    e.stopPropagation();
    var src = this.currentSrc || this.src || $(this).attr('src') || '';
    var matchedIdx = -1;
    for (var i = 0; i < galleryPhotos.length; i++) {
        if (src.indexOf(galleryPhotos[i]) !== -1) {
            matchedIdx = i;
            break;
        }
    }
    showGalleryPhoto(matchedIdx !== -1 ? matchedIdx : 0);
    $('#lightbox').css('display', 'flex').hide().fadeIn('fast');
});

$(document).on('click', '.lightbox-prev', function(e) {
    e.stopPropagation();
    showGalleryPhoto(currentPhotoIndex - 1);
});

$(document).on('click', '.lightbox-next', function(e) {
    e.stopPropagation();
    showGalleryPhoto(currentPhotoIndex + 1);
});

// Close when clicking outside image or on close button
$(document).on('click', '#lightbox, .lightbox-close', function(e) {
    if (e.target.id === 'lightbox-img' || $(e.target).closest('.lightbox-prev, .lightbox-next').length) return;
    $('#lightbox').fadeOut('fast', function() {
        $('#lightbox-img').attr('src', '');
    });
});

// ESC key closes lightbox, Left/Right arrows navigate
$(document).keyup(function(e) {
    if (!$('#lightbox').is(':visible')) return;
    if (e.keyCode === 27) {
        $('#lightbox').fadeOut('fast', function() {
            $('#lightbox-img').attr('src', '');
        });
    } else if (e.keyCode === 37) {
        showGalleryPhoto(currentPhotoIndex - 1);
    } else if (e.keyCode === 39) {
        showGalleryPhoto(currentPhotoIndex + 1);
    }
});

// Touch swipe support for mobile
var touchStartX = 0;
var touchEndX = 0;
$(document).on('touchstart', '#lightbox', function(e) {
    if (e.originalEvent && e.originalEvent.touches) {
        touchStartX = e.originalEvent.touches[0].clientX;
    }
});
$(document).on('touchend', '#lightbox', function(e) {
    if (e.originalEvent && e.originalEvent.changedTouches) {
        touchEndX = e.originalEvent.changedTouches[0].clientX;
        var diffX = touchEndX - touchStartX;
        if (Math.abs(diffX) > 40) {
            if (diffX < 0) {
                showGalleryPhoto(currentPhotoIndex + 1); // Swipe left = next
            } else {
                showGalleryPhoto(currentPhotoIndex - 1); // Swipe right = prev
            }
        }
    }
});