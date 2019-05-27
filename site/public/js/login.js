
    //hint() on top
    function hint() {
        let hit = document.getElementById("hint")
        hit.style.display = "block"
        hit.style.opacity = 1
    }
    //Call back
    function submit(url,callback) {
        let request = new XMLHttpRequest()
        request.open("post", url, true)
        //request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        let data = new FormData()

        data.append(username, username.value)
        data.append(password, password.value)
        request.onreadystatechange = function() {
            if (this.readyState == 4) {
                callback.call(this, this.response)
                console.log(this.responseText)
            }
        }
        console.log(data.get(username))
        request.send(data)
    }

    //Sign in
    function signin() {
        let status = document.getElementById("status").getElementsByTagName("i")
        let hit = document.getElementById("hint").getElementsByTagName("p")[0]
        if (onoff) {
            confirm.style.height = 51 + "px"
            status[0].style.top = 35 + "px"
            status[1].style.top = 0
            onoff = !onoff
        } else {
            if (!/^[A-Za-z0-9]+$/.test(username.value))
                hit.innerHTML = "username can only conatin numbers and alphabets"
            else if (username.value.length < 6)
                hit.innerHTML = "username must not be shorter than 6"
            else if (password.value.length < 6)
                hit.innerHTML = "password must not be shorter than 6"
            else if (password.value != con_pass.value)
                hit.innerHTML = "Two passwords not equal"
            else if (password.value = con_pass.value) {
                let url = "/signup"
                submit(url,function(res) {
                    if (res == "exist")
                        hit.innerHTML = "Username exists, registration failed!"
                    else if (res == "true") {

                        hit.innerHTML = "Registration successed! Back in <span id='myspan'>5</span> seconds..."
                        setTimeout("backIndex()", 5000)
                        mytime = setInterval("changeSec()",1000);
                        localStorage.setItem("user",username.value); 
                    } else if (res == "false")
                        hit.innerHTML = "Registration failed!"
                })
            }

            hint()
        }
    }


    //login
    function login() {

        if (onoff) {     
               let hit = document.getElementById("hint").getElementsByTagName("p")[0]
                let url = "/login"
                submit(url,function(res) {
                  if (res == "true", function(){hint()}) {
                        hit.innerHTML = "Login successed! Back in <span id='myspan'>5</span> seconds..."
                        setTimeout("backIndex()", 5000)
                        mytime = setInterval("changeSec()",1000);
                        localStorage.setItem("user",username.value); 
                        
                    } else if (res == "false",function(){hint()})
                        hit.innerHTML = "Login failed!"
                        hint()
                })
                
            
        } else {
            let status = document.getElementById("status").getElementsByTagName("i")
            confirm.style.height = 0
            status[0].style.top = 0
            status[1].style.top = 35 + "px"
            onoff = !onoff
        }
    }
    function backIndex() {
          clearInterval(mytime);
          window.open("index.html","_self");
        }
    function changeSec() {
           $('myspan').innerText=$('myspan').innerText-1;
        }
    function $(id) {
        return document.getElementById(id);
      }


