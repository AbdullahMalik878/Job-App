const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
                    title: { type: String, required: true },
                    pubDate: { type: Date, required: true },
                    description: { type: String, required: true },
                    category: { type: String, default: "No category available" },
                    skills: [String],
                    budget: { type: String, default: "No budget available" },
                    hourlyRange: { type: String, default: "No hourly range available" },
                    country: { type: String, default: "No country available" },
                    applyLinks: [String], // Updated to handle array of links
                    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
