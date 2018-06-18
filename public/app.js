$(document).ready(function(){
    $("#comment_modal").modal({show: false})

    initializePage();

    $(document).on("click", "#scraper", scrapeArticles);
    $(document).on("click", "#saved_articles", getSavedArticles);
    $(document).on("click", ".add_favorite", addToFavoritesPage);
    $(document).on("click", ".remove_favorite", removeFromFavoritesPage);

    function initializePage() {
        //First, clear out the 'articles' div
        $("#articles").empty();
        //Next, we're going to grab all the articles the user hasn't flagged.
        $.get("/articles")
            .then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    $("#articles").append(
                        `<div class="row">
                        <div class="col-sm-12"><div class="card">
                        <div class="card-header"><a class="article-url" target="_blank" href="${data[i].link}">${data[i].title}</a></div>
                        <div class="card-body">
                        <button type="button" class="btn-primary btn add_favorite" id="${data[i]._id}">Add to Favorites <ion-icon name="bookmark"></ion-icon></button>
                        <button type="button" class="btn btn-link comment" data-toggle="modal" data-target="#comment_modal" id="${data[i]._id}">Sound Off <ion-icon name="chatboxes"></ion-icon></button>
                        </div></div></div></div>`
                    )
                }
            });
    }

    function scrapeArticles() {
        $.get("/scrape")
            .then(function(data) {
                alert("scrape complete");
                console.log(data);
                initializePage();
            })
    }

    function addToFavoritesPage(){
        //grab the ID from the button
        var articleId = $(this).attr("id");
        console.log(articleId);
        $.ajax({
            method: "POST",
            url: `/add_fave/${articleId}`
        })
        .then(function(data){
            console.log(data)
            initializePage();
        })
    }

    function removeFromFavoritesPage() {
        var articleId = $(this).attr("id");
        console.log(articleId);
        $.ajax({
            method: "POST",
            url: `/remove_fave/${articleId}`
        })
        .then(function(data) {
            console.log(data)
            initializePage();
        })
    }

    function getSavedArticles(){
        $("#articles").empty();
        $("#articles").append(`<h3 id="saved_header">Your Saved Articles</h3>`)
        $.get("/saved")
            .then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    $("#articles").append(
                        `<div class="row">
                        <div class="col-sm-12"><div class="card">
                        <div class="card-header"><a class="article-url" target="_blank" href="${data[i].link}">${data[i].title}</a></div>
                        <div class="card-body">
                        <button type="button" class="btn-danger btn remove_favorite" id="${data[i]._id}">Remove from Favorites <ion-icon name="bookmark"></ion-icon></button>
                        <button type="button" class="btn btn-link comment" data-toggle="modal" data-target="#comment_modal" id="${data[i]._id}">Sound Off <ion-icon name="chatboxes"></ion-icon></button>
                        </div></div></div></div>`
                    )
                }
            })
    }

    $(document).on("click", ".comment", function(){
        var articleId = $(this).attr("id");
        console.log(articleId);
        $(document).on("click", "#add_note", function(){
            var commentInfo = $("#comment_info").val().trim();

            $.ajax({
                method: "POST",
                url: `/add_note/${articleId}`,
                data: {
                    body: commentInfo
                }
            })
            .then(function(data) {
                console.log(data);
            })
            $("#comment_info").val("");
            $("#comment_modal").modal({show: false})
        })
    })

})
