// Activates the Carousel
$('.carousel').carousel({
  interval: 5000
})

// Activates Tooltips for Social Links
$('.tooltip-social').tooltip({
  selector: "a[data-toggle=tooltip]"
})

// get HTTP GET parameter
function get_HTTP_GET_parameter() {
	return window.location.search.replace("?", "");
}
