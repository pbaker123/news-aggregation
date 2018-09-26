var number = 5;
var intervalId;

function scrape() {
  number = 5;
	$
    .ajax("/scrape", {
		  type: "GET"
	  })
    .then(() => {
		  $(".scrape").html("Processing... 5");
		  countdown(".scrape");
	  });
};

function purge() {
  number = 4;
  $
    .ajax("/delete", {
      type: "DELETE"
    })
      $(".purge").html("Processing... 4");
      countdown(".purge");
};

function decrement(type) {
	number--;
	$(type).html("Processing... " + number);
};

function countdown(id) {
  clearInterval(intervalId);
  intervalId = setInterval(function() {decrement(id)}, 1000);
  setTimeout(function() {window.location.href = "/";}, 5000);
}

function save(id) {
	var update = {
		_id: id,
		saved: true,
		unsaved: false
	};
  $.ajax("/save", {
    type: "POST",
    data: update
  }).then(function () {
  	location.reload();
  });
};

function unsave(id) {
	var update = {
		_id: id,
		saved: false,
		unsaved: true
	};
  $.ajax("/save", {
    type: "POST",
    data: update
  }).then(function () {
  	location.reload();
  });
};

function formatModal(id, title) {
  $("#submit").attr("data-id", id);
  $("#articleTitle").html("")
  if (title.length > 31 ) {
    for (var i = 0; i < 30; i++) {
      $("#articleTitle").append(title[i])  
    }
  	$("#articleTitle").append(" . . . ")
  } else {
    $("#articleTitle").html(title)
  };
};

function populateNotes(id) {
  $.ajax("/notes/" + id, {
    type: "GET"
  }).then(function(dbNotes) {
    $("#note-body").html("");
    for (var i = 0; i < dbNotes.length; i++) {
      $("#note-body").append('<li id="' + dbNotes[i]._id + '" class="list-group-item">' + dbNotes[i].note + '<button type="button" class="close delete-note" aria-label="Close" data-id="' + dbNotes[i]._id + '"><span aria-hidden="true">&times;</span></button></li>')
    };
    $('#notess').modal('show');
  });
};

function submitNote(id) {
  var newEntry = {
    note: $("#new-note").val().trim(),
    id: id
  };
  $.ajax("/notes", {
    type: "POST",
    data: newEntry
  }).then(function() {
    $("#notess").modal("hide");
    $("#new-note").val("");
  });
};

function deleteNote(id) {
  $.ajax("/deletenote/" + id, {
    type: "DELETE"
  })
  $("#" + id ).remove();
};

// Ensure the page is loaded before beginning
$(document).ready(function() {
	$("html").on("click", ".scrape", function(event) {
		event.preventDefault();
		scrape();
	});
  $("html").on("click", ".purge", function(event) {
    event.preventDefault();
    purge();
  });
  $("html").on("click", ".save", function(event) {
    event.preventDefault();
    save($(this).attr("data-id"));
  });
  $("html").on("click", ".unsave", function(event) {
  	event.preventDefault();
  	unsave($(this).attr("data-id"))
  });
  $("html").on("click", ".notes", function(event) {
  	formatModal($(this).data("id"), $(this).data("title"));
    populateNotes($(this).data("id"))
    $('#notess').modal('show');
  });
  $("html").on("click", "#submit", function(event) {
    submitNote($(this).data("id"));
  });
  $("html").on("click", ".delete-note", function(event) {
    deleteNote($(this).data("id"))
  })
});