let number = 5;
let intervalId;

function scrape () {

  number = 5;
	$
    .ajax("/scrape", {
		  type: "GET"
	  })
    .then(() => {

		  $(".scrape").html("Processing... 5");
		  countdown(".scrape");
	  
});

}

function purge () {

  number = 4;
  $
    .ajax("/delete", {
      type: "DELETE"
    });
      $(".purge").html("Processing... 4");
      countdown(".purge");

}

function decrement (type) {

	number--;
	$(type).html("Processing... " + number);

}

function countdown (id) {

  clearInterval(intervalId);
  intervalId = setInterval(() => {

 decrement(id);

}, 1000);
  setTimeout(() => {

window.location.href = "/"; 

}, 5000);

}

function save (id) {

	const update = {
		_id: id,
		saved: true,
		unsaved: false
	};
  $.ajax("/save", {
    type: "POST",
    data: update
  }).then(() => {

  	location.reload();
  
});

}

function unsave (id) {

	const update = {
		_id: id,
		saved: false,
		unsaved: true
	};
  $.ajax("/save", {
    type: "POST",
    data: update
  }).then(() => {

  	location.reload();
  
});

}

function formatModal (id, title) {

  $("#submit").attr("data-id", id);
  $("#articleTitle").html("");
  if (title.length > 31) {

    for (let i = 0; i < 30; i++) {

      $("#articleTitle").append(title[i]);  
    
}
  	$("#articleTitle").append(" . . . ");
  
} else {

    $("#articleTitle").html(title);
  
}

}

function populateNotes (id) {

  $.ajax("/notes/" + id, {
    type: "GET"
  }).then((dbNotes) => {

    $("#note-body").html("");
    for (let i = 0; i < dbNotes.length; i++) {

      $("#note-body").append('<li id="' + dbNotes[i]._id + '" class="list-group-item">' + dbNotes[i].note + '<button type="button" class="close delete-note" aria-label="Close" data-id="' + dbNotes[i]._id + '"><span aria-hidden="true">&times;</span></button></li>');
    
}
    $('#notess').modal('show');
  
});

}

function submitNote (id) {

  const newEntry = {
    note: $("#new-note").val()
.trim(),
    id
  };
  $.ajax("/notes", {
    type: "POST",
    data: newEntry
  }).then(() => {

    $("#notess").modal("hide");
    $("#new-note").val("");
  
});

}

function deleteNote (id) {

  $.ajax("/deletenote/" + id, {
    type: "DELETE"
  });
  $("#" + id).remove();

}

// Ensure the page is loaded before beginning
$(document).ready(() => {

	$("html").on("click", ".scrape", (event) => {

		event.preventDefault();
		scrape();
	
});
  $("html").on("click", ".purge", (event) => {

    event.preventDefault();
    purge();
  
});
  $("html").on("click", ".save", function (event) {

    event.preventDefault();
    save($(this).attr("data-id"));
  
});
  $("html").on("click", ".unsave", function (event) {

  	event.preventDefault();
  	unsave($(this).attr("data-id"));
  
});
  $("html").on("click", ".notes", function (event) {

  	formatModal($(this).data("id"), $(this).data("title"));
    populateNotes($(this).data("id"));
    $('#notess').modal('show');
  
});
  $("html").on("click", "#submit", function (event) {

    submitNote($(this).data("id"));
  
});
  $("html").on("click", ".delete-note", function (event) {

    deleteNote($(this).data("id"));
  
});

});
