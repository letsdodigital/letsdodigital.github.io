var owl = $('.owl-carousel');
owl.owlCarousel({
  items: 1,
  loop: true,
  margin: 10,
  autoplay: true,
  autoplayTimeout: 5000,
  autoplayHoverPause: true,
  smartSpeed: 1000
});

$(document).ready(function () {
  $('.owl-item').removeClass('zoom-effect');
  $('.owl-item.active').addClass('zoom-effect');
});

owl.on('translated.owl.carousel', function (event) {
  $('.owl-item').removeClass('zoom-effect');
  $('.owl-item.active').addClass('zoom-effect');
});
