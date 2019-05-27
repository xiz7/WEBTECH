function changeDom(){
    //ajax call
     $.ajax({
              url: '/change',
              method:'POST',
              data: {list: "some info"}
            }).done(function(data){
                //if we have a successful post request 
                if(data.success){
                            let i = 0;
                    while(i < data.data.length){
                       let listitem = 
                          '<li>' +
                             '<p class="posted" name="info">' + data.data[i].info + '</p>' +
                             '<img class="images" name="img" src="' + data.data[i].imageurl+ '" width="480" height="270" alt=""/>'+
                             '<p class="text" name="title">' + data.data[i].title + 
                             '<input type="button" class="trigger" id=' + data.data[i].title + ' value = "like" style="float :right; margin-right: 460px;"/></p>' +
                             
                          '</li>';
                       $('ul.mydisplay').append(listitem);
                       i++;
                    }
                    return;
                }
            }).fail(function(){
               //do nothing ....
                console.log('failed...');
                return;
            });
            };
            $('.mydisplay').on('click', '.trigger', function(event){
                $.ajax({
                            url: '/like',
                            method:'POST',
                            data: {title: event.currentTarget.id}
                }).done(function(data){
                    console.log(data);
                    if(data.success){
                        location.reload();
                    }
                }).fail(function(err){
                    console.log(err);
                });
            });

  if (window.addEventListener) {
     window.addEventListener('load', changeDom);
  } else if (window.attachEvent) {
     window.attachEvent('onload', changeDom);
  } else { 
     window.onload = changeDom;
  }