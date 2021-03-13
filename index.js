const express = require("express");
const engine  = require("ejs-mate");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine", "ejs");
app.engine("ejs", engine);
app.set("views", __dirname + "/views");

const {getData} = require("./scripts/requests");



// tv show search result data
let searchResult = [];
let lastSearchedShow = "";

// store in locals the last searched show
app.use((req, res, next)=> {
    res.locals.searchRes = lastSearchedShow;
    next();
})

// prevent default requests for favicon
app.use((req, res, next) => {
    if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
      return res.sendStatus(204);
    }
    return next();
  });


  // get all details for episode
app.get("/show/:showId/season/:seasonId/episode", async (req, res)=> {
    let {showId, seasonId} = req.params;
    let {season, number} = req.query;
    let detailsForEpisode = await getData(`shows/${showId}/episodebynumber?season=${season}&number=${number}`);
    res.render("shows/episode", {detailsForEpisode, showId, seasonId});
})


// get all episode list for season
app.get("/show/:showId/season/:seasonId", async (req, res)=> {
    let {showId, seasonId} = req.params;
    let episodes = await getData(`seasons/${seasonId}/episodes`);
    res.render("shows/episodes", {episodes, showId, seasonId});
})

// get all seasons list for show
app.get("/show/:showId/seasons", async (req, res)=> {
    let {showId} = req.params;
    let showSeasons = await getData(`shows/${showId}/seasons`);
    res.render("shows/seasons", {showSeasons, showId});
})

// get results for show search
app.get("/", async (req, res)=> {
    res.render("home", {searchResult})
})

app.post("/", async (req, res)=> {
    let {search} = req.body;
    lastSearchedShow = search;
    searchResult = await getData(`search/shows?q=${search}`)
    res.redirect("/")
})

app.get("*", (req, res)=> {
    res.render("error")
})

app.listen(3000, ()=> {
    console.log("App startet on port 3000");
})