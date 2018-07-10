$(document).on("click", ".scrapebutton", function () {
    $.ajax({
        method: "GET",
        url: "/scrape",
    })
})

//Save articles
$(document).on("click", ".saveButton", function () {
    // Save the id from the saved note
    var savedArticleId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "post",
        url: "/api/savearticle/" + savedArticleId,
    })
        .done(function (data) {
            window.location = "/"
        })
})

//Delete an article
$(document).on("click", ".deleteButton", function () {
    // Save the id from the saved note
    var deleteSavedArticleId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "post",
        url: "/api/deletesavearticle/" + deleteSavedArticleId,
    })
    .done(function (data) {
        window.location = "/saved"
    })
})

//Save a note
$(document).on("click", ".saveNotesButton", function () {
    // Save the id from the saved note
    var newNoteId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/api/savenote/" + newNoteId,
        data: {
            text: $("#note" + newNoteId).val(),
            // created: Date.now()
            }
        }).done(function(data) {
            // Log the response
            console.log(data);
            $("#note" + newNoteId).val("");
            window.location = "/saved"
        })
})

//Delete a note
$(document).on("click", ".deleteNote", function () {
    // Save the id from the saved note
    var deleteNoteId = $(this).attr("data-id");

    $.ajax({
        method: "DELETE",
        url: "/api/deletenote/" + deleteNoteId,
        }).done(function(data) {
            // Log the response
            window.location = "/saved"
        })
})

