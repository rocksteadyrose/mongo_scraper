$(document).on("click", ".scrapebutton", function () {
    $.ajax({
        method: "GET",
        url: "/api/getarticles",
    }).done(function(data) {
    })
})

// Whenever someone clicks a save button
$(document).on("click", ".saveButton", function () {
    // Save the id from the saved note
    var savedNoteId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "POST",
        url: "/api/savedarticles/" + savedNoteId,
    })
    .done(function(data) {
        window.location = "/"
    })
})
