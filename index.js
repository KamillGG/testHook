const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();
const port = 3000; // Choose a suitable port

// Body parser middleware
app.use(bodyParser.json());

// Endpoint to handle GitHub webhook events
app.post("/post", (req, res) => {
  const { body } = req;

  // Check if the payload is a push event
  if (body && body.ref === "refs/heads/main") {
    // If the push event is for the main branch, execute git pull
    exec("git pull origin main", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send("Failed to pull changes");
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      res.status(200).send("Changes pulled successfully");
    });
  } else {
    // For other events, send a success response
    res.status(200).send("Event not processed");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}/github-webhook`);
});
