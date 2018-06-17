$(document).ready(function(){

    initializePage();

    $(document).on("click", "add_favorite", addToFavoritesPage);

    function initializePage() {
        //First up, on page load - we're going to grab all the articles the user hasn't flagged.
        $.get("/articles")
            .then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    $("#articles").append(
                        `<div class="row"><div class="col-sm-12">
                        <h3 class="${data[i]._id}">
                        <a class="article-url" target="_blank" href="${data[i].link}">${data[i].title}</a>
                        </h3>
                        <button type="button" class="btn-primary btn add_favorite">Add to Favorites <ion-icon name="bookmark"></ion-icon></button>
                        <button type="button" class="btn btn-link">Sound Off <ion-icon name="chatboxes"></ion-icon></button>
                        </div></div>`
                    )
                }
            });
    }

    function addToFavoritesPage(){
        $.post("/add_fave")
    }

})
