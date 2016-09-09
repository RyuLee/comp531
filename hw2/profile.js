
var doc = window.document;
function isChanged(a,b){
	if(a.value!= "" &&a.value!=b.innerHTML){
		return true;
	}else return false;
}
function validate(){
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

	var name_re = /[a-zA-Z0-9]*/;
	if(name.value!=""&&!name_re.test(name.value)){
		alert("Please input valid name!")
		name.value = "";
	}
	var email_re = /[a-zA-Z0-9]{1,8}@[a-zA-Z0-9]{1,8}\..{1,8}/;
	if(email.value!=""&&!email_re.test(email.value)){
		alert("Please input valid email!")
		email.value = "";
	}
	var tel_re = /\d{3}-\d{3}-\d{4}/;
	if(tel.value!=""&&!tel_re.test(tel.value)){
		alert("Please input valid Telphone!")
		tel.value = "";
	}
	var zipcode_re = /\d{5}/;
	if(zipcode.value!=""&&!zipcode_re.test(zipcode.value)){
		alert("Please input valid Telphone!")
		zipcode.value = "";
	}
	if(pwd.value!=""&&pwd.value!=pwdc.value){
		alert("Password Confirmation is not as same as password.");
		pwd.value = "";
		pwdc.value = "";
	}
	var tupleList = [[name,name_value],[email,email_value],[tel,tel_value],[zipcode,zipcode_value]];
	var valueList = ["Display Name","Email","Telphone","zipcode"]
	var flagList = [isChanged(name,name_value),isChanged(email,email_value),isChanged(tel,tel_value),isChanged(zipcode,zipcode_value)];
	var hasChanged = false;
	for(var i = 0; i < flagList.length; i++){
		if(flagList[i] == true){
			hasChanged = true;
			break;
		}
	}
	if(hasChanged){
		var msg = "You have changed"
		for(var i = 0; i < flagList.length; i++){
			if(flagList[i] == true){
				msg += ("  "+valueList[i]);
			}
		}
		alert(msg);
		for(var i = 0; i < flagList.length; i++){
			if(flagList[i] == true){
				tupleList[i][1].innerHTML = tupleList[i][0].value;
				tupleList[i][0].value = "";
			}
		}
	}else{
		alert("You changed nothing!");
	}
}
