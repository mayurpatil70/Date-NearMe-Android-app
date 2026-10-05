const Story = require("../models/Story");

exports.uploadStory = async (req, res) => {
  try {
    console.log("upload story");
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    // Create the story in the database using the Cloudinary URL
    const newStory = await Story.create({
      user: req.user._id, // Assumes you have your auth middleware protecting this route
      mediaUrl: req.file.path,
    });

    res.status(201).json({
      message: "Story uploaded successfully",
      story: newStory,
    });
  } catch (error) {
    console.log("Error uploading story:", error);
    res
      .status(500)
      .json({ message: "Error uploading story", error: error.message });
  }
};

exports.getStories = async (req, res) => {
  try {
    // Fetch active stories and populate the user details (name, avatar)
    const stories = await Story.find().populate("user", "name avatar");
    res.status(200).json(stories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching stories", error: error.message });
  }
};
