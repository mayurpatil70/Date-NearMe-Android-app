const Story = require("../models/story");

exports.uploadStory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const userId = req.user.id || req.user._id;

    // Create the story in PostgreSQL using the Cloudinary URL
    const newStory = await Story.create({
      userId,
      mediaUrl: req.file.path,
    });

    res.status(201).json({
      message: "Story uploaded successfully",
      story: newStory,
    });
  } catch (error) {
    console.error("Error uploading story:", error);
    res
      .status(500)
      .json({ message: "Error uploading story", error: error.message });
  }
};

exports.getStories = async (req, res) => {
  try {
    const stories = await Story.findActive();
    res.status(200).json(stories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching stories", error: error.message });
  }
};
