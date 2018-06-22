$(document).ready(function(){
    $("#comment_modal").modal({show: false})

    initializePage();

    //Set up all of the listeners
    $(document).on("click", "#scraper", scrapeArticles);
    $(document).on("click", "#go_home", initializePage);
    $(document).on("click", "#saved_articles", getSavedArticles);
    $(document).on("click", ".add_favorite", addToFavoritesPage);
    $(document).on("click", ".remove_favorite", removeFromFavoritesPage);

    //Function will run on page load and after most routes to refresh the page
    function initializePage() {
        //First, clear out the 'articles' div
        $("#articles").empty();
        //Next, we're going to grab all the articles the user hasn't flagged.
        $.get("/articles")
            .then(function(data) {
                //Cap it at 50 articles displaying at once.  You can only consume so much trump news.
                for (var i = 0; i < 51; i++) {
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
                console.log(data);
                location.reload();
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
        $("#articles").append(`<div id="header_storage" class="card"><h3 class="card-header" id="saved_header">Your Saved Articles</h3></div>`)
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

    //Listen for a click on any comment button
    $(document).on("click", ".comment", function(){
        //Grab the article ID from that button
        var articleId = $(this).attr("id");
        //Pass the article ID into the getComments fx to pull back all Comments on that Articl
        getComments(articleId);
        console.log(articleId);
        //Then wait for the user to click the modal button to add a comment
        $(document).on("click", "#add_note", function(){
            //Grab the comment
            var commentInfo = $("#comment_info").val().trim();
            //Shoot if off to the DB
            $.ajax({
                method: "POST",
                url: `/add_note/${articleId}`,
                data: {
                    body: commentInfo
                }
            })
            .then(function(data) {
                console.log(data);
                //Shut off the click event listener
                $(document).off("click", "#add_note");
            })
            //Clear the comment box & dismiss the modal
            $("#comment_info").val("");
            $("#comment_modal").modal({show: false});
        })
    })

    function getComments(articleId) {
        $("#comment_holder").empty();
        $.ajax({
            method: "GET",
            url: `/comments/${articleId}`
        })
        .then(function(comments) {
            console.log(comments);
            for (var i = 0; i < comments.length; i++) {
                $("#comment_holder").append(
                    `<div class="container"><div class="row">
                        <div="col-sm-12>
                            <p class="comment">${comments[i]}</p>
                        </div>
                    </div></div><hr>`
                )
            }
        })
    }
})
