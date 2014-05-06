jQuery(function ($) {
	'use strict';
	var board = '',
			topi,
			i,
			j,
			$player = $('.leader-board .player'),
			$tr,
			$score,
			$fill,
			id,
			run = 0,
			score,
			name = '',
			photo = '',
			user_id,
			timeID,
			time = 120,
			tps = 400 / time,
			coordClick = [-1, -1],
			click = false;

	var Users = {
			constructor: function(place, name, score, photo) {
				this.place = place || 0;
				this.name = name || 'none';
				this.score = score || 0;
				this.photo = photo || 'http://vk.com/images/camera_50.gif';
				return this;
			}
		};
	var users = [],
			ajax = [];

	var Ajax = {
		constructor: function(place, num) {
			this.place = place;
			this.num = num;
			return this;
		},
		result: function(i, place) {
			$.ajax({
				type: 'post',
				url: 'php/get_record.php',
				data: 'place='+this.place,
				beforeSend: function() {
					$player.eq(i).find('.foto').css('background-image', 'url(img/ajax-loader.gif)');
				},
				success: function(data) {
					var sliceData = data.split(', ');
					var ajname = sliceData[0] || 'none',
							ajscore = sliceData[1] || 0,
							ajphoto = sliceData[2] || 'http://vk.com/images/camera_50.gif';
					$player.eq(i).find('.foto').css('background-image', 'url('+sliceData[2]+')');
					$player.eq(i).find('span').eq(0).text((place+1)+' - место');
					$player.eq(i).find('span').eq(1).text(sliceData[0]);
					$player.eq(i).find('.scores').text('Очки: '+sliceData[1]);
				},
				error: function(xhr, str) {
					alert(xhr+'bad');
				}
			});
		}
	};
	
	VK.init(function() {
		 // API initialization succeeded
		 // Your code here
			VK.api('users.get', {fields: 'photo_50'}, function(data) {
				name = data.response[0].last_name+' '+data.response[0].first_name;
				photo = data.response[0].photo_50;
				user_id = data.response[0].id;
				alert('Привет '+name+'!');
			});
	}, function() {
		 // API initialization failed
		 // Can reload page here
		 alert('Initialization failed!');
	}, '5.21');
	
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
		score++;
		$score.text(score);
    run--;
    if (run === 0) {
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
//		animateScore();
		score += run;
		run = 0;
		$score.text(score);

    setTimeout(function () {
      animateQuad(0, xmin, ymin, xmax, ymax);
    }, 300);
//    id = setInterval(animateScore, 500/run);
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

	function stepTimer() {
		var fill = parseInt($fill.css('width'), 10) - tps;
		$fill.css('width', fill);
		if (fill <= 0) {
			clearInterval(timeID);
			$('.menu').slideDown();
			$.ajax({
				type: 'post',
				url: 'php/add_record.php',
				data: 'name='+name+'&score='+score+'&photo='+photo+'&id='+user_id,
				success: function(data) {
					alert('Вы набрали '+score+'очков!');
				},
				error: function(xhr, str) {
					alert(xhr+'bad');
				}
			});
		}
	}
	
	function getRecord() {
		for (i = topi, j = 0; i < topi+10; i++, j++) {
			ajax[j] = Object.create(Ajax).constructor(i, j);
		}
		
		for (i = 0, j = topi-1; i < 10; i++, j++) {
			ajax[i].result(i, j);
		}
	}

	$('.nav').on('click', '#start', function () {
		$('.menu').slideUp();
		$fill.css('width', 400);
		score = 0;
		$score.text(score);
		timeID = setInterval(stepTimer, 1000);
	});
	
	$('.nav').on('click', '#top', function () {
		$('.top-players').css('left', 0);
		topi = 1;
		
		for (i = 0; i < 10; i++) {
			users[i] = Object.create(Users).constructor();
		}
		getRecord();

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
	
	$('.top-players').on('click', '#next', function () {
		if (topi+10 > 91) {
			return;
		}
		topi += 10;
		getRecord();
	});
	
	$('.top-players').on('click', '#prev', function () {
		if (topi-10 < 1) {
			return;
		}
		topi -= 10;
		getRecord();
	});
	
	generateBoard();
});