$(document).on("click", ".scrapebutton", function () {
    // Grab the articles as a json
    $(".articles").empty();

    $.getJSON("/getarticles", function (data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
            $(".articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<button type='button' class='btn btn-primary saveButton' data-toggle='modal' data-target='#saveModal' data-id='" + data[i]._id + "'>Save</button>" + "</p>");
        }
    });

})

// Whenever someone clicks a save button
$(document).on("click", ".saveButton", function () {
    // Save the id from the saved note
    var savedNoteId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/savedarticles/" + savedNoteId,
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            $(".savedarticles").append("<h2>" + data.title + "</h2>");
            // An input to enter a new title
            $(".savedarticles").append("<h2>" + data.link + "</h2>");
            data.saved = true;
        });
});