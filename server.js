require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

const schedule_interval = "0 0 * * 1"; // Every monday at midnight

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// Scheduled function that runs every Saturday
async function scheduledTask() {
  try {
    //console.log(`[${new Date().toISOString()}] Running scheduled task...`);

    // Add your scheduled task logic here
    // Example: Fetch and process data from Supabase
    const { data, error } = await supabase
      .from("next")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    //console.log("Scheduled task completed successfully:", data);

    let datalength = data.length;
    if (datalength > 0) {
      let randomIndex = Math.floor(Math.random() * datalength);
      let randomSOTW = data[randomIndex];

      const { error: insertError } = await supabase.from("sotws").insert({
        spotify_url: randomSOTW.spotify_url,
        track: randomSOTW.track,
        artist: randomSOTW.artist,
        image: randomSOTW.image,
        user: randomSOTW.user,
      });

      if (insertError) throw insertError;
      //console.log("New SOTW inserted successfully:", randomSOTW);
    }

    // Delte all elements of "next" table
    const { error: deleteError } = await supabase
      .from("next")
      .delete()
      .neq("id", 0);

    if (deleteError) throw deleteError;
  } catch (error) {
    console.error("Error in scheduled task:", error);
  }
}

// Schedule the task using node-cron
// Cron syntax: second minute hour day-of-month month day-of-week
// '0 0 * * 6' = Every Saturday at midnight (00:00)
// For testing every minute: '* * * * *'
// For testing every hour: '0 * * * *'
cron.schedule(schedule_interval, scheduledTask, {
  timezone: "Europe/Stockholm",
});

console.log("Scheduled task set to run every Monday at midnight");

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Generic GET endpoint to fetch all records from a table
// Example: GET /api/users
app.get("/api/sotw", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("sotws")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ success: true, sotw: data[0].spotify_url });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
