require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Job = require('./models/Job');
const Parser = require('rss-parser');
const { JSDOM } = require('jsdom');

const app = express();
const port = process.env.PORT || 5000;
const parser = new Parser();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Fetch and save jobs from RSS feed
const fetchAndSaveJobs = async () => {
  try {
    const feed = await parser.parseURL('https://www.upwork.com/ab/feed/jobs/rss');
    const newJobs = feed.items.map(item => {
      const dom = new JSDOM(item.content);
      const description = dom.window.document.body.textContent;

      const applyLinkMatches = description.match(/(?:Apply\s*Here\s*:\s*|Apply\s*Link\s*:\s*)(https?:\/\/[^\s]+)/gi);

      const hourlyRangeMatch = description.match(/(?:Hourly\s*Rate|Hourly\s*Range)\s*:\s*([\d\s\$\-]+)/i);
      const budgetMatch = description.match(/Budget\s*:\s*([\d\s\$\-]+)/i);
      const categoryMatch = description.match(/Category\s*:\s*([^\n]+)/i);
      const countryMatch = description.match(/Country\s*:\s*([^\n]+)/i);
      const skillsMatch = description.match(/(?:Skills|Required Skills)\s*:\s*([^\n]+)/i);

      const formattedDescription = description.replace(/(?:Hourly\s*Rate|Hourly\s*Range|Budget|Category|Country|Skills|Required Skills|Apply\s*Here\s*:\s*https?:\/\/[^\s]+):[^\n]*\n?/gi, '').trim();
      const uniqueSkills = [...new Set(skillsMatch ? skillsMatch[1].split(',').map(skill => skill.trim()) : [])];

      return {
        title: item.title || "No title available",
        pubDate: new Date(item.pubDate),
        description: formattedDescription || "No description available",
        category: categoryMatch ? categoryMatch[1].trim() : "No category available",
        skills: uniqueSkills,
        budget: budgetMatch ? budgetMatch[1].trim() : "No budget available",
        hourlyRange: hourlyRangeMatch ? hourlyRangeMatch[1].trim() : "No hourly range available",
        country: countryMatch ? countryMatch[1].trim() : "No country available",
        applyLinks: applyLinkMatches ? applyLinkMatches.map(link => link.trim()) : [], // Ensure all links are captured
        createdAt: new Date()
      };
    });

    // Save or update new jobs
    for (const job of newJobs) {
      await Job.updateOne({ title: job.title, pubDate: job.pubDate }, job, { upsert: true });
    }

    console.log("Jobs updated in MongoDB");
  } catch (error) {
    console.error("Error fetching and saving jobs:", error);
  }
};

app.get('/api/jobs', async (req, res) => {
  const { filter } = req.query;
  const today = new Date();
  const filters = {};

  if (filter === 'today') {
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    filters.createdAt = { $gte: startOfDay, $lte: endOfDay };
  } else if (filter === 'lastWeek') {
    const endOfWeek = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today.setDate(today.getDate() - 7));
    filters.createdAt = { $gte: startOfWeek, $lt: endOfWeek };
  } else if (filter === 'lastMonth') {
    const endOfMonth = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.setMonth(today.getMonth() - 1));
    filters.createdAt = { $gte: startOfMonth, $lt: endOfMonth };
  }

  try {
    const jobs = await Job.find(filters).sort({ createdAt: -1 }); // Sort by createdAt in descending order
    if (jobs.length === 0) {
      return res.json({ message: 'No jobs found for the selected filter.' });
    }
    res.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

app.get('/api/job-skills', async (req, res) => {
  const { startDate, endDate } = req.query;

  const filters = {};

  if (startDate && endDate) {
    filters.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  try {
    const jobs = await Job.find(filters);

    const skillsCount = {};

    jobs.forEach((job) => {
      job.skills.forEach((skill) => {
        if (skillsCount[skill]) {
          skillsCount[skill]++;
        } else {
          skillsCount[skill] = 1;
        }
      });
    });

    const skills = Object.keys(skillsCount);
    const counts = Object.values(skillsCount);

    res.json({ skills, counts });
  } catch (error) {
    console.error('Error fetching skills data:', error);
    res.status(500).json({ message: 'Error fetching skills data' });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  fetchAndSaveJobs();
});
