

document.addEventListener('DOMContentLoaded', function() {
	
	let elems = document.querySelectorAll('.sidenav');
	let instances = M.Sidenav.init(elems, {edge : true});
});

document.addEventListener('DOMContentLoaded', function() {

	let elems = document.querySelectorAll('select');
	let instances = M.FormSelect.init(elems, {});
});

document.addEventListener('DOMContentLoaded', function() {
	let elems = document.querySelectorAll('.collapsible');
	let instances = M.Collapsible.init(elems, {
		accordion : true
	});
})