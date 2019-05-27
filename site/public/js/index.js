      window.onload = update;
     function update(){
        //ajax call
         $.ajax({
                  url: '/update_index',
                  method:'POST',
                  data: {list: "some info"}
                }).done(function(data){
                    //if we have a successful post request ... 
                    if(data.success){
                        //change the DOM &
                        //set the data in local storage to persist upon page request
                        //localStorage.setItem("permanentData", data.message);
                        //var savedText = localStorage.getItem("permanentData");
                        let i = 0;
                        while(i < data.data.length){
                           let listitem = 
                              '<li>' +
                             '<img class="images" name="img" src="' + data.data[i].imageurl+ '" width="480" height="270" alt=""/>'+
                                 '<p class="posted" name="info">' + data.data[i].info + '</p>' +
 
                                 '<p class="text" name="title">' + data.data[i].title + 
                              '</li>';
                           $('ul.style').append(listitem);
                           i++;
                        }
                        $('#p1').html(data.data[0].title);
                        $('#p2').html(data.data[0].info);
                        $('#p3').html(data.data[0].info);
                        $('#p4').html(data.data[1].title);
                        $('#p5').html(data.data[1].info);
                        $('#p6').html(data.data[1].info);
                        $('#p7').html(data.data[2].title);
                        $('#p8').html(data.data[2].info);
                        $('#p9').html(data.data[2].info);
                        return;
                    }
                }).fail(function(){
                   //do nothing ....
                    console.log('failed...');
                    return;
                });
        };