function load_data(){
  console.log("load run");
  var theme=localStorage.getItem("user");
  if(theme==null||theme==""){
    $("#login").show(); 
    $("#uname").hide();
    $("#exit").hide();
    $("#space").hide();     
  }else{
     $("#login").hide();  
     $("#uname").show();
     $("#uname").html("Hi, "+ theme);
     $("#space").show();
     $("#exit").show();
  }
}

function exitu(){
  localStorage.removeItem("user"); 
  load_data();
}
