function myData(info){
  //remove all rows excpet first row in table
  $("#results tr:gt(0)").remove();
  //append table tags to each field
  $.get(info).done(function(json){
    json.forEach(function(mysurvey){
      var tr = $('<tr>');

      tr.append($('<td>', {
        text: mysurvey.Name
      }));

      tr.append($('<td>', {
        text: mysurvey.ComputerOS
      }));

      tr.append($('<td>', {
        text: mysurvey.PhoneOS
      }));

      tr.append($('<button>', {
          text: "X",
          class: "delete btn btn-sm btn-danger",
          id: mysurvey._id
      }));

      $('#results').append(tr);
    });
  });
}

//invoke data
myData('/survey');

$(function(){
  //sort by Computer button
  $('#computer').on('click', function(){
    myData('/computer');
  });

  //sort by Phone button
  $('#phone').on('click', function(){
    myData('/phone');
  });

  //sort by Name button
  $('#name').on('click', function(){
    myData('/name');
  });

  //post new information to a webpage
  $('#update').on('submit', function(){
    $.ajax({
      method: 'POST',
      url: '/survey',
      datatype: 'json',
      data: {
        Name: $('#name').val().trim(),
        ComputerOS: $('#computerOS').val().trim(),
        PhoneOS: $('#phoneOS').val().trim()
      }
    }).done(function(data){
      myData('/survey');
    });
});

//change new information on a webpage
  $('.change').on('submit', function(){
    $.ajax({
      method: 'PUT',
      url: '/survey:id',
      datatype: 'json',
      data: {
        Name: $('#name').val().trim(),
        ComputerOS: $('#computerOS').val().trim(),
        PhoneOS: $('#phoneOS').val().trim()
      }
    }).done(function(data){
      myData('/survey');
    });
  });

  //delete new information on a webpage
    // $('.delete').on('click', function(){
    //   $.ajax({
    //     method: 'POST',
    //     url: '/survey:id',
    //     datatype: 'json',
    //     data: {
    //       Name: $('#name').val().trim(),
    //       ComputerOS: $('#computerOS').val().trim(),
    //       PhoneOS: $('#phoneOS').val().trim()
    //     }
    //   }).done(function(data){
    //     myData('/survey');
    //   });
    // });

$(document.body).on("click", "button", function(){
    $.ajax({
      method: 'DELETE',
      url: '/survey/' + $(this).attr('id')
    }).done(function(){
      myData('/survey/:id');
      $(this).closest("tr").remove();
    });
 });


});
