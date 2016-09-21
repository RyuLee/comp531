/**
/**
**	Author:Pengyu Li
*/
function updateAct(){
	$("#activityDisplay")[0].innerHTML = $("#activity")[0].value
	$("#activity")[0].value = ""

}

function clearText(){
	var textarea = $("#textarea1")
	var title = $('#title')
	title[0].value = ""
	textarea[0].value = ""
}
window.onload = () => {
	$('.tooltipped').tooltip({delay: 50});
	$("#sideNav").sideNav();
	$('.modal-trigger').leanModal();
	$('.collapsible').collapsible({
      accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });


}



