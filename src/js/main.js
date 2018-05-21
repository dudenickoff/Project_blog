import $ from 'jquery';
Date.prototype.getMonthName = function() {
    var month = ["January", "February", "March", "April",
      "May", "June", "July", "August", "September",
      "October", "November", "December"
    ];
    return month[this.getMonth()];
  }
  // Initialize Firebase
  
$(document).ready(function($) {
  var formModal = $('.cd-user-modal'),
    formLogin = formModal.find('#cd-login'),
    formSignup = formModal.find('#cd-signup'),
    formModalTab = $('.cd-switcher'),
    tabLogin = formModalTab.children('li').eq(0).children('a'),
    tabSignup = formModalTab.children('li').eq(1).children('a'),
    mainNav = $('.main-nav');
    mainNav.on('click', '.cd-signin', login_selected);
  mainNav.on('click', function(event) {
    $(event.target).is(mainNav) && mainNav.children('ul').toggleClass('is-visible');
  });

  //open sign-up form
  mainNav.on('click', '.cd-signup', signup_selected);
  //open login-form form
  mainNav.on('click', '.cd-signin', login_selected);
  //close modal
  formModal.on('click', function(event) {
    if ($(event.target).is(formModal) || $(event.target).is('.cd-close-form')) {
      formModal.removeClass('is-visible');
    }
  });
  //close modal when clicking the esc keyboard button
  $(document).keyup(function(event) {
    if (event.which == '27') {
      formModal.removeClass('is-visible');
    }
  });

  //switch from a tab to another
  formModalTab.on('click', function(event) {
    event.preventDefault();
    ($(event.target).is(tabLogin)) ? login_selected(): signup_selected();
  });

  //hide or show password
  $('.hide-password').on('click', function() {
    var togglePass = $(this),
      passwordField = togglePass.prev('input');

    ('password' == passwordField.attr('type')) ? passwordField.attr('type', 'text'): passwordField.attr('type', 'password');
    ('Hide' == togglePass.text()) ? togglePass.text('Show'): togglePass.text('Hide');
    //focus and move cursor to the end of input field
    passwordField.putCursorAtEnd();
  });
function login_selected() {
    mainNav.children('ul').removeClass('is-visible');
    formModal.addClass('is-visible');
    formLogin.addClass('is-selected');
    formSignup.removeClass('is-selected');
    tabLogin.addClass('selected');
    tabSignup.removeClass('selected');
  };

  function signup_selected() {
    mainNav.children('ul').removeClass('is-visible');
    formModal.addClass('is-visible');
    formLogin.removeClass('is-selected');
    formSignup.addClass('is-selected');
    tabLogin.removeClass('selected');
    tabSignup.addClass('selected');
  };
});

  