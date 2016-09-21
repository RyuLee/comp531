function getTimestamp() { //function to get current time stamp
    var currentTimestamp = new Date(document.lastModified).getTime();
    var input = document.getElementById("in2");
    input.value = currentTimestamp;
}

function formValidate(form) { // function to do validation for form
    getTimestamp();
    if (!form) {
        form = document.getElementById("myForm");
    }
    for (var i = 0; i < form.length; i++) {
        if (form[i].name == "bday" && form[i].value != "") {
            var bday = form[i].valueAsDate;
            var date = new Date();
            var timeDiff = date.getTime() - bday.getTime();
            if (timeDiff > 0) {
                var diffYears = Math.ceil(timeDiff / (1000 * 3600 * 24 * 365));
                if (diffYears < 18) { // if someone is under 18 years old, he is not permitted to register.
                    Materialize.toast("You can't register under 18 years old!",3000);
                    return false;
                } else if (diffYears > 150) { // no one can live longer than 150 years old.
                    Materialize.toast("No one can live longer than 150!",3000);
                    bday.value = "";
                    return false;
                }
            } else {
                Materialize.toast("You\'re not from future!",3000);// no one can born later than today
                bday.value = "";
                return false;
            }
        } else if (form[i].name == "confirmation" && form[i].value != "") { //check if password is same as password confirmation
            if (form[i - 1].value != "") {
                if (form[i - 1].value != form[i].value) {
                    Materialize.toast("The password and password confirmation you entered are not the same！",3000);
                    form[i].value = "";
                }
            }
        }
    }
}

function displayForm() {// if user click register, register form appears and login form disappears.
    window.document.querySelector(".login").style.display = "none";
    window.document.querySelector(".center-form").style.display = "inline";
}
function undisplayForm() {// if user click register, register form appears and login form disappears.
    window.document.querySelector(".login").style.display = "inline";
    window.document.querySelector(".center-form").style.display = "none";
}
function loginValidation() {
    var act = window.document.querySelector("#loginAct").value;
    var pwd = window.document.querySelector("#loginPwd").value;
    if(act == "abc123"&& pwd == "123456"){ //if account matchs password, redirect to other page.
        window.location.replace("main.html");
    }else if(act==""){ // customize error information.
        Materialize.toast('Account Name can\'t be empty', 4000);
    }else if(pwd==""){
        Materialize.toast('Password can\'t be empty', 4000);
    }else {
        Materialize.toast('Account or Password is wrong', 4000);
    }
}
