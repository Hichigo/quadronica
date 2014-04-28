jQuery(function ($) {
	'use strict';
	var board = '',
			i,
			j,
			$tr,
			$score,
			$fill,
			score = 0,
			id,
			run = 0,
			score = 0,
			timeID,
			time = 10,
			tps = 400 / time,
			coordClick = [-1, -1],
			click = false;

  function equal(a, b) {
    return (a === b) ? true : false;
  }

  function max(a, b) {
    return (a > b) ? a : b;
  }

  function min(a, b) {
    return (a < b) ? a : b;
  }

  function colorand() {
    var color = ['#da261b', '#0a7538', '#f0b327', '#007dbf'];
    return color[Math.floor(Math.random() * 4)];
  }

	function reset(x, y) {
		$tr.eq(coordClick[1]).find('.td').eq(coordClick[0]).removeClass('active');
    $tr.eq(y).find('.td').eq(x).removeClass('active');
    coordClick = [-1, -1];
    click = false;
  }

  function animateQuad(scale, minx, miny, maxx, maxy) {
    if (scale) {
      for (i = miny; i <= maxy; i++) {
        for (j = minx; j <= maxx; j++) {
          $tr.eq(i).find('.td').eq(j).css({'transform': 'scale(0.05)'}).removeClass('active');
					run++;
        }
      }
    } else {
      for (i = miny; i <= maxy; i++) {
        for (j = minx; j <= maxx; j++) {
          $tr.eq(i).find('.td').eq(j).css({'transform': 'scale(1)', 'background-color': colorand()});
        }
      }
    }
  }

	function animateScore() {
		$score.text(score++);
    run--;
    if (run === -1) {
      clearInterval(id);
    }
  }

  function update(x1, y1, x2, y2) {
    var one = $tr.eq(y1).find('.td').eq(x1),
				two = $tr.eq(y2).find('.td').eq(x2),
				three = $tr.eq(y2).find('.td').eq(x1),
				four = $tr.eq(y1).find('.td').eq(x2);

    if (!equal(one.css('background-color'), three.css('background-color'))) {
      one.removeClass('active');
      two.removeClass('active');
      reset();
      score -= 50;
      $score.text(score);
      return;
    }
    if (!equal(two.css('background-color'), four.css('background-color'))) {
      one.removeClass('active');
      two.removeClass('active');
      reset();
      score -= 50;
      $score.text(score);
      return;
    }
    if (!equal(four.css('background-color'), three.css('background-color'))) {
      one.removeClass('active');
      two.removeClass('active');
      reset();
      score -= 50;
      $score.text(score);
      return;
    }

    var xmax = max(x1, x2),
				xmin = min(x1, x2),
				ymax = max(y1, y2),
				ymin = min(y1, y2);

    animateQuad(1, xmin, ymin, xmax, ymax);
		animateScore();

    setTimeout(function () {
      animateQuad(0, xmin, ymin, xmax, ymax);
    }, 300);
    id = setInterval(animateScore, 500/run);
  }

  function generateBoard() {
    for (i = 0; i < 10; i++) {
      board += '<div class="tr">';
      for (j = 0; j < 10; j++) {
        board += '<div class="td" data-x="' + j + '" data-y="' + i + '" style="background-color: ' + colorand() + '"></div>';
      }
      board += '</div>';
    }
    $('.board').append(board);
		board = '<div class="score">0</div>';
		board += '<div class="timer"><div class="fill-timer"></div></div>';
		$('.content').append(board);

		$score = $('.score');
    $tr = $('.tr');
		$fill = $('.fill-timer');
		
	}

  $('.board').on('click', '.td', function () {
    var x = parseInt($(this).attr('data-x'), 10),
				y = parseInt($(this).attr('data-y'), 10);
		$(this).addClass('active');

		if (x === coordClick[0] && y === coordClick[1]) {
      reset(x, y);
    } else if (x === coordClick[0] || y === coordClick[1]) {
      reset(x, y);
      score -= 50;
      $score.text(score);
    } else if (!click) {
      coordClick = [x, y];
      click = true;
    } else {
      update(coordClick[0], coordClick[1], x, y);
      reset(x, y);
    }
  });
	
	$('.nav').on('click', '#start', function () {
		$('.menu').slideUp();
		$fill.css('width', 400);
		score = 0;
		timeID = setInterval(function () {
      var fill = parseInt($fill.css('width'), 10) - tps;
			$fill.css('width', fill);
			if(fill <= 0) {
				clearInterval(timeID);
				$('.menu').slideDown();
				$.ajax({
					type: 'post',
					url: 'php/add_record.php',
					data: 'score='+score,
					success: function(data) {
						console.log(data+'norm');
					},
					error: function(xhr, str) {
						alert(xhr+'bad');
					}
				});
			}
		}, 1000);
	});
	
	$('.nav').on('click', '#top', function () {
		$('.top-players').css('left', 0);
	});
	
	$('.nav').on('click', '#about', function () {
		$('.about').css('left', 0);
	});
	
	$('.about').on('click', '#back', function () {
			$('.about').css('left', '100%');
	});
	
	$('.top-players').on('click', '#back', function () {
			$('.top-players').css('left', '-100%');
	});
	
	generateBoard();
});

//jQuery(function($) {
//  $('.menu').on('click', '#start', function() {
//    init();
//		$('.menu').slideUp();
//    $fill.css('width', 365);
//    timeID = setInterval(function() {
//      var fill = parseInt($fill.css('width'), 10) - tps;
//      $fill.css('width', fill);
//      if(fill <= 0) {
//        clearInterval(timeID);
//        $('.menu').slideDown();
//      }
//    }, 1000);
//  });
//});