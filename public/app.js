$(document).on("click", ".scrapebutton", function () {
    $.ajax({
        method: "GET",
        url: "/api/getarticles/",
    })
})

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

$(document).on("click", ".saveNotesButton", function () {
    // Save the id from the saved note
    var newNoteId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/api/savenote/" + newNoteId,
        data: {
            text: $("#note" + newNoteId).val(),
            created: Date.now()
            }
        }).done(function(data) {
            // Log the response
            console.log(data);
            $(".notessection").append($("#note" + newNoteId).val());
        })
})

