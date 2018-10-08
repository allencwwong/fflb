(function ($) {

  $(document).ready(function () {

    // pages

    var leaguePage = $('.main-page').html();
    var teamsPage = '';
    var whsPage = '';

    // console.log(leaguePage);

    // page load
    $('.page').hide();
    $('#leaguePage').show();

    // nav active
    $('.rank-list li a').on('click', function () {
      $('.rank-list li').removeClass('active');
      $(this).parent().addClass('active');
      $('.page').hide();
      var pageId = '#' + $(this).data('page-id');
      var title = $(this).data('title');
      $('#rank-heading').text(title);
      console.log($(this).data('title'))
      $(pageId).show();

    })

    $('.rank-list .league-ranks').on('click', function () {
      $("#comingSoonPage").hide();
      $('.main-page').html(leaguePage);
    })


    // =================== //
    // team page
    // =================== //

    $('.rank-list .team-ranks').on('click', function () {
      $("#comingSoonPage").hide();
      if (teamsPage != '') {
        $('.main-page').html(teamsPage);
      } else {
        loadTeamPage();
      }
    });


    // load data for teams
    function loadTeamPage() {
      var requestUrl = '/api/v1/teams/all&""';
      $.ajax({
        url: requestUrl,
        type: 'GET',
        contentType: 'application/json',
        data: 'json',
        beforeSend: function () {
          console.log('show block');
          $("#loadingPage").show();
          // $('.main-page').html('');
        },
        success: function (teams) {
          $("#loadingPage").hide();
          // console.log(teams);
          teams.sort(function (a, b) {
            if (a.standing && b.standing) {
              return b.standing.points_for - a.standing.points_for
            }
          })

          var cardBodyHtml = '';

          teams.forEach(function (team, idx) {

            cardBodyHtml += `<div class="col-12 col-md-6 col-lg-3 mb-3">
            <div class="card card-long card-grey my-3" data-rank="${idx}" data-league="${team.leagueId}">
            <div class="card-body"><div class="position-absolute badge badge-dark m-2" style="z-index:99;">T Rank:${team.standing.rank}</div><div class="position-absolute badge badge-dark m-2 l-rank" style="z-index:99;">L Rank:${idx+1}</div><div class="row"><div class="col-md-12 py-3"><img class=team-icon src="${team.profileImg}"></div><div class="col-md-12 text-center"><h1 class=team-heading>${team.teamName}</h1><div class=row><div class="col-12 pb-2 px-3 pt-1"><div class=team-info>${team.leagueName}</div></div><div class="col-12 pb-2 px-3"><div class=team-info>${team.manager} </div></div></div><div class="mb-3 mt-2"><div class=team-ts>Total Score</div><h2 class=team-heading2>${team.standing['points_for']}</h2></div><div class=row><div class="col-5 offset-1"><div>W - L - T</div><div class=ft-ysanbold>${team.standing.outcome_totals.wins}-${team.standing.outcome_totals.losses}-${team.standing.outcome_totals.ties}</div></div><div class=col-5><div>W/L Ratio</div><div class=ft-ysanbold>${(team.standing.outcome_totals.percentage * 100).toFixed(2)}%</div></div></div></div></div></div></div></div>`;
          })


          $('.main-page').html('').append(cardBodyHtml);
          teamsPage = $('.main-page').html();

        }
      })
    }

    // =================== //
    // whs page
    // =================== //

    $('.rank-list .weekly-ranks').on('click', function () {
      $("#comingSoonPage").hide();
      if (whsPage != '') {
        $('.main-page').html(whsPage);
      } else {
        loadWhssPage();
      }

    });

    // load data for teams
    function loadWhssPage() {
      var requestUrl = '/api/v1/whs';
      $.ajax({
        url: requestUrl,
        type: 'GET',
        contentType: 'application/json',
        data: 'json',
        beforeSend: function () {
          console.log('show block');
          // $("#comingSoonPage").show();
          $('.main-page').html('');
        },
        success: function (whss) {
          // $("#comingSoonPage").show();
          console.log(whss);
          // whss.sort(function (a, b) {
          //   if (a.standing && b.standing) {
          //     return b.standing.points_for - a.standing.points_for
          //   }
          // })

          var cardBodyHtml = '<div class="row"></div>';

          whss.forEach(function (whs) {

            cardBodyHtml += `<div class="col-12 col-lg-3 col-md-6 mb-3"><div class="card card-gold card-long my-3"><div class=card-body><div class=row><div class=col-md-12><div class=card-header>Week${whs.week}</div><div class=py-3><img class=team-icon src="${whs.team.profileImg}"></div></div><div class="col-md-12 text-center"><div class=row><h1 class="col-12 team-heading">${whs.team.teamName}</h1><div class="col-12 pb-2 px-3 pt-1"><div class=team-info>${whs.team.leagueName}</div></div><div class="col-12 pb-2 px-3"><div class=team-info>${whs.team.manager}</div></div></div><div class="mb-3 mt-2"><div class=team-ts>High Score</div><h2 class=team-heading2>${whs.score}</h2></div><div class=row><div class="col-5 offset-1"><div>W - L - T</div><div class=ft-ysanbold>${whs.team.standing.outcome_totals.wins}-${whs.team.standing.outcome_totals.losses}-${whs.team.standing.outcome_totals.ties}</div></div><div class=col-5><div>W/L Ratio</div><div class=ft-ysanbold>${(whs.team.standing.outcome_totals.percentage * 100).toFixed(2)}%</div></div></div></div></div></div><div class="card-footer card-league-footer"data-target=#myModal data-toggle=modal>view more</div></div></div>`;
          })

          cardBodyHtml += '</div>'
          $('.main-page').html('').append(cardBodyHtml);
          whsPage = $('.main-page').html();

        }
      })
    }


    // =================== //
    // league page
    // =================== //

    // card flip
    var isFlipped = false;
    $('.card-back').hide();

    function flipOver(e, self) {
      console.log('over')
      if (!isFlipped) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        self.parent().parent().css({
          "transform": "rotateY(180deg)"
        })
        self.parent().parent().find('.card-body').css({
          "transform": "rotateY(180deg)"
        })
        self.parent().parent().find('.card-footer').hide();
        self.parent().parent().find('.card-front').hide();
        self.parent().parent().find('.card-back').show();
        isFlipped = true;
      } else {
        e.stopPropagation();
        e.stopImmediatePropagation();
        self.parent().parent().css({
          "transform": "rotateY(360deg)"
        })
        self.parent().parent().find('.card-body').css({
          "transform": "rotateY(360deg)"
        })
        self.parent().parent().find('.card-footer').show();
        self.parent().parent().find('.card-front').show();
        self.parent().parent().find('.card-back').hide();
        isFlipped = false;
      }
    }


    function getFlipData(leagueId, self, e) {
      var requestUrl = '/api/v1/teams/' + 'leagueId' + '&' + leagueId;
      $.ajax({
        url: requestUrl,
        type: 'GET',
        contentType: 'application/json',
        data: 'json',
        success: function (teams) {
          teams.sort(function (a, b) {
            return a.standing.rank - b.standing.rank
          })
          teams = teams.slice(0, 4);

          var cardbackHtml = '<div class="league-teams col-md-12"><h2 class="card-back-heading text-center">Top 4 Teams</h2><div class="container">';

          teams.forEach(function (team) {
            console.log(team);
            cardbackHtml += ` <div class="row text-center card-back-team-container"><span class="col-6 card-back-team">${team.teamName}</span><span class="col-6 card-back-team"><${team.manager}></span><span class="col-6 card-back-team ft-red ft-ysanbold">${team.standing.points_for}</span><span class="col-6 ft-ysanbold ft-green">${team.standing.outcome_totals.wins}-${team.standing.outcome_totals.losses}-${team.standing.outcome_totals.ties}</span></div>`
          })

          cardbackHtml += '</div></div>';

          self.find('.card-back').html(cardbackHtml);

          flipOver(e, self);
        }
      })
    }

    $('.main-page').on('click', '.flip-card', function (e) {
      console.log('flip me')
      var self = $(this).find('.card-flipable');
      var leagueId = $(this).data('league');
      getFlipData(leagueId, self, e);

    });

    // better way to load

    $('.main-page').on('click', '.btn-flip', function (e) {

      var self = $(this).parent().parent().find('.card-flipable');
      var lid = self.parent().parent().data('league')
      getFlipData(lid, self, e);
    });


  });

  // card footer view more

  $('.main-page').on('click', '.card-league-footer', function () {
    var leagueId = $(this).parent().data('league');
    console.log(leagueId);
    $.ajax({
      url: '/league/' + leagueId,
      type: 'GET',
      contentType: 'application/json',
      data: 'json',
      success: function (data) {
        console.log(data);
        $('#myModal .modal-title').html(data[0].leagueName);
        var modalBody = '<table class="table"><thead><th>Rank</th><th>Team</th><th>Manager</th><th>Total Points</th><th>W-L-T</th><th>Win Ratio</th></thead><tbody>';
        data.forEach(function (team) {
          var name = team.teamName;
          var manager = team.manager;
          var img = team.profileImg;
          var rank = team.standing.rank;
          var outcome = team.standing.outcome_totals.wins + '-' + team.standing.outcome_totals.losses + '-' + team.standing.outcome_totals.ties;
          var outcomePercent = (team.standing.outcome_totals.percentage * 100).toFixed(2);
          var total = team.standing.points_for;

          modalBody += `<tr><td>${rank}</td><td><img src="${img}" style="width:48px;border-radius:50%;margin-right:.7rem;" />${name}</td><td>${manager}</td><td>${total}</td><td>${outcome}</td><td>${outcomePercent}</td></tr>`;

        }) // end of team loop

        modalBody += '</tbody></table>';

        $('#myModal .modal-body').html(modalBody);

      }
    });

  })



  // =================== //
  // slide out
  // =================== //

  // Toggle button
  document.querySelector('.toggle-button').addEventListener('click', function () {
    slideout.toggle();
  });


  var slideout = new Slideout({
    'panel': document.getElementById('panel'),
    'menu': document.getElementById('menu'),
    'padding': 180,
    'tolerance': 70
  });


  slideout.open();

  var isColExpanded = false;
  $('.rank-title-m').hide();
  $('.rank-heading-icon').hide();

  slideout.on('open', function () {
    if (isColExpanded) {

      // edit icon
      $('.rank-heading-icon').hide();
      $('.rank-heaading').show();
      $('.rank-icon').addClass('col-12').removeClass('col-5 mx-0 px-0');
      $('.rank-icon i').addClass('fa-3x').removeClass('fa-2x');
      $('.rank-list li').addClass('p-4').removeClass('px-3 pb-2 mb-2');
      $('.rank-title').show();
      $('.rank-title-m').hide();

      console.log('make col smaller')
      var classList = $('#mainContent').attr('class').split(/\s+/);
      console.log('open:', classList)
      $('#mainContent').removeClass();
      classList.forEach(function (className) {
        console.log(className)
        var classNameSplit = className.split('-');
        var newClassName = classNameSplit[0] + '-' + classNameSplit[1] + '-' + (parseInt(classNameSplit[2]) - 1);
        console.log(newClassName)
        $('#mainContent').addClass(newClassName);
      });
      isColExpanded = false;
    }

  });


  slideout.on('close', function () {
    document.querySelector('.slideout-menu').style.display = 'block';

    if (!isColExpanded) {
      // edit icon
      $('.rank-heading-icon').show();
      $('.rank-heaading').hide();
      $('.rank-icon').removeClass('col-12').addClass('col-5 mx-0 px-0');
      $('.rank-icon i').removeClass('fa-3x').addClass('fa-2x');
      $('.rank-list li').removeClass('p-4').addClass('px-3 pb-2 mb-2');
      $('.rank-title').hide();
      $('.rank-title-m').show();

      // edit col width
      console.log('make col bigger')
      var classList = $('#mainContent').attr('class').split(/\s+/);
      // change menu from full to icon only
      $('#mainContent').removeClass();
      classList.forEach(function (className) {
        console.log(className)
        var classNameSplit = className.split('-');
        var newClassName = classNameSplit[0] + '-' + classNameSplit[1] + '-' + (parseInt(classNameSplit[2]) + 1);
        console.log(typeof newClassName)
        $('#mainContent').addClass(newClassName);
      });
    }
    isColExpanded = true;

  });



})(jQuery);