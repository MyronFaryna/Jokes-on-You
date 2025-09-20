//Below are everything relative to libraries and standard variables.
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://v2.jokeapi.dev/joke/Any?contains=";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

function renderJoke(res, { content = null, setup = null, delivery = null } = {}) {
  res.render("index.ejs", { content, setup, delivery });
}


//--------------------------------------------------------------------------------
//User First look
app.get("/", (req, res) => {
  renderJoke(res);
});
//--------------------------------------------------------------------------------
//Results when he interacts
app.post("/post", async (req, res) => {
  const searchTerm = (req.body.search || "").trim();

  if (!searchTerm) {   /*if empty statement*/
    return renderJoke(res, {content: "Please provide a search term."});
  }
//--------------------------------------------------------------------------------
  try {
    const url = API_URL + encodeURIComponent(searchTerm);
    const result = await axios.get(url);

    if (result.data.type === "single"){  /*if joke one sentence*/
      renderJoke(res, {content: result.data.joke});
//--------------------------------------------------------------------------------
    } else {    /*if joke two sentence*/
      renderJoke(res, {setup: result.data.setup, delivery : result.data.delivery});
//--------------------------------------------------------------------------------
    }
  } catch (error) {
    renderJoke(res, {content: `No joke was found with the word "${searchTerm}"`});
  }
});
//--------------------------------------------------------------------------------
//Port listening
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
//--------------------------------------------------------------------------------!