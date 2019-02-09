function getResults() {
    $("#results").empty();
    $.getJSON("/all", function(data) {
      for (var i = 0; i < data.length; i++) {
        $("#results").prepend("<p class='data-entry' data-id=" + data[i]._id + "><span class='dataTitle' data-id=" +
          data[i]._id + ">" + data[i].title + "</span><span class=delete>X</span></p>");
      }
    });
  }
  
  // Runs the getResults function 
  getResults();
  
  // Making a new note
  $(document).on("click", "#make-new", function() {
    $.ajax({
      type: "POST",
      dataType: "json",
      url: "/submit",
      data: {
        title: $("#title").val(),
        note: $("#note").val(),
        created: Date.now()
      }
    })
      .then(function(data) {
        $("#results").prepend("<p class='data-entry' data-id=" + data._id + "><span class='dataTitle' data-id=" +
        data._id + ">" + data.title + "</span><span class=delete>X</span></p>");
        $("#note").val("");
        $("#title").val("");
      });
  });
  
  // When the #clear-all button is pressed
  $("#clear-all").on("click", function() {
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "/clearall",
      success: function(response) {
        $("#results").empty();
      }
    });
  });
  
  
  // Upon clicking delete button for note
  $(document).on("click", ".delete", function() {
    var selected = $(this).parent();
    $.ajax({
      type: "GET",
      url: "/delete/" + selected.attr("data-id"),
  
      // On successful call
      success: function(response) {
        selected.remove();
        $("#note").val("");
        $("#title").val("");
        $("#action-button").html("<button id='make-new'>Submit</button>");
      }
    });
  });
  
  // Displaying note and allowing updates
  $(document).on("click", ".dataTitle", function() {
    var selected = $(this);
    $.ajax({
      type: "GET",
      url: "/find/" + selected.attr("data-id"),
      success: function(data) {
        $("#note").val(data.note);
        $("#title").val(data.title);
        $("#action-button").html("<button id='updater' data-id='" + data._id + "'>Update</button>");
      }
    });
  });
  
  // Upon clicking update button
  $(document).on("click", "#updater", function() {
    var selected = $(this);
    $.ajax({
      type: "POST",
      url: "/update/" + selected.attr("data-id"),
      dataType: "json",
      data: {
        title: $("#title").val(),
        note: $("#note").val()
      },
      // On successful call
      success: function(data) {
        $("#note").val("");
        $("#title").val("");
        $("#action-button").html("<button id='make-new'>Submit</button>");
        getResults();
      }
    });
  });
  