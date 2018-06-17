$(document).ready(function(){

    initializePage();

    $(document).on("click", "#scraper", scrapeArticles);
    $(document).on("click", ".add_favorite", addToFavoritesPage);

    function initializePage() {
        //First, clear out the 'articles' div
        $("#articles").empty();
        //Next, we're going to grab all the articles the user hasn't flagged.
        $.get("/articles")
            .then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    $("#articles").append(
                        `<div class="row"><div class="col-sm-12">
                        <h3>
                        <a class="article-url" target="_blank" href="${data[i].link}">${data[i].title}</a>
                        </h3>
                        <button type="button" class="btn-primary btn add_favorite" id="${data[i]._id}">Add to Favorites <ion-icon name="bookmark"></ion-icon></button>
                        <button type="button" class="btn btn-link">Sound Off <ion-icon name="chatboxes"></ion-icon></button>
                        </div></div>`
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

})
