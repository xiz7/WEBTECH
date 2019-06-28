function load_data(){
    console.log("load run");
    var user = localStorage.getItem("user");
    var logintime = localStorage.getItem("timestamp");
    now = new Date()
    timediff = Date.parse(now) - Date.parse(logintime);
    timelimit = 1000 * 60 * 3 // 3 minutes
    if(user==null || user=="" || timediff > timelimit){
        $("#login").show(); 
        $("#uname").hide();
        $("#exit").hide();
        $("#space").hide();
        if(timediff > timelimit){
        console.log("t");
        localStorage.removeItem("user");
        localStorage.setItem("timestamp", new Date());
        }
    }else{
        $("#login").hide();  
        $("#uname").show();
        $("#uname").html("Hi, "+ user);
        $("#space").show();
        $("#exit").show();
    }
}

function exitu(){
    localStorage.removeItem("user");
    let request = new XMLHttpRequest()
    request.open("POST", "/users/logout", true);
    request.send();
    location.href = "/";
    load_data();
}
 