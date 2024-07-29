const mongoose = require("mongoose");

const connectDB = async () => {
                    try {
                                        mongoose.connect("mongodb://sadammuneer:sadam%40123456@ac-fmojhku-shard-00-00.07bagy7.mongodb.net:27017,ac-fmojhku-shard-00-01.07bagy7.mongodb.net:27017,ac-fmojhku-shard-00-02.07bagy7.mongodb.net:27017/jobApp?ssl=true&replicaSet=atlas-dha073-shard-0&authSource=admin&retryWrites=true&w=majority", {
                                        });

                                        console.log("MongoDB connected.");
                    } catch (error) {
                                        console.error("Error connecting to MongoDB:", error);
                                        process.exit(1);
                    }
};

module.exports = connectDB;
