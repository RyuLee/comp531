
var doc = window.document;
function isChanged(a,b){ // the function that indicate if some value in profile has been changed
	if(a.value!= "" &&a.value!=b.innerHTML){
		return true;
	}else return false;
}
function validate(){
	// get dom objects
	var name = doc.getElementById("name");
	var name_value = doc.getElementById("name_value");
	var email = doc.getElementById("email");
	var email_value = doc.getElementById("email_value");
	var tel = doc.getElementById("tel");
	var tel_value = doc.getElementById("tel_value");
	var zipcode = doc.getElementById("zipcode");
	var zipcode_value = doc.getElementById("zipcode_value");
	var pwd = doc.getElementById("pwd");
	var pwdc = doc.getElementById("pwdc");
	// use regexp to check if a input is valid
	var name_re = /[a-zA-Z0-9]*/;
	if(name.value!=""&&!name_re.test(name.value)){
		Materialize.toast("Please input valid name!",3000)
		name.value = "";
	}
	var email_re = /[a-zA-Z0-9]{1,8}@[a-zA-Z0-9]{1,8}\..{1,8}/;
	if(email.value!=""&&!email_re.test(email.value)){
		Materialize.toast("Please input valid email!",3000)
		email.value = "";
	}
	var tel_re = /\d{3}-\d{3}-\d{4}/;
	if(tel.value!=""&&!tel_re.test(tel.value)){
		Materialize.toast("Please input valid Telphone!",3000)
		tel.value = "";
	}
	var zipcode_re = /\d{5}/;
	if(zipcode.value!=""&&!zipcode_re.test(zipcode.value)){
		Materialize.toast("Please input valid Telphone!",3000)
		zipcode.value = "";
	}
	if(pwd.value!=""&&pwd.value!=pwdc.value){
		Materialize.toast("Password Confirmation is not as same as password.",3000);
		pwd.value = "";
		pwdc.value = "";
	}
	if(pwd.value==""&&pwdc.value!=""){
		Materialize.toast("Please input your new password",3000);
		pwd.value = "";
		pwdc.value = "";
	}
	// use tupleList to check if value is changed
	var tupleList = [[name,name_value],[email,email_value],[tel,tel_value],[zipcode,zipcode_value]];
	var valueList = ["Display Name","Email","Telphone","zipcode"]
	var flagList = [isChanged(name,name_value),isChanged(email,email_value),isChanged(tel,tel_value),isChanged(zipcode,zipcode_value)];
	var hasChanged = false;
	for(var i = 0; i < flagList.length; i++){
		if(flagList[i] == true){
			hasChanged = true;  //if some value has been changed, jump out of loop
			break;
		}
	}
	if(hasChanged){
		var msg = "You have changed"
		for(var i = 0; i < flagList.length; i++){
			if(flagList[i] == true){
				msg += ("  "+valueList[i]); // find which value has been changed, then delegate it has been changed
			}
		}
		Materialize.toast(msg,3000);
		for(var i = 0; i < flagList.length; i++){
			if(flagList[i] == true){
				tupleList[i][1].innerHTML = tupleList[i][0].value; // display changes on current info panel
				tupleList[i][0].value = "";
			}
		}
	}else if(pwd.value!=""&&pwdc.value==pwd.value){	// find if password has been changed and if the confirmation is valid
		Materialize.toast("You have changed password",3000);
		pwd.value = "";
		pwdc.value = "";
	}else{
		Materialize.toast("You changed nothing!",3000);
	}
}
window.onload = () => {
	$('.tooltipped').tooltip({delay: 50}); // initilize tooltip
}
