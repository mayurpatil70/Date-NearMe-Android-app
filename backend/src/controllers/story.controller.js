const Story = require("../models/story");

exports.uploadStory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No media file provided" });
    }

    const userId = req.user?.id || req.user?._id;
    const mediaUrl = req.file.path || req.file.secure_url || req.file.url;

    if (!mediaUrl) {
      return res.status(400).json({ message: "Could not generate media URL" });
    }

    // Create the story in PostgreSQL using the Cloudinary URL
    const newStory = await Story.create({
      userId,
      mediaUrl,
    });

    res.status(201).json({
      message: "Story uploaded successfully",
      story: {
        id: newStory.id,
        img: newStory.media_url,
        user: req.user?.displayName || req.user?.email?.split("@")[0] || "You",
        time: "Just now",
        userId,
      },
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
    const rawStories = await Story.findActive();
    const formatted = rawStories.map((s) => ({
      id: s.id,
      img: s.media_url,
      user: s.user_name || "Member",
      time: "Recent",
      userId: s.user_id,
    }));
    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching stories:", error);
    res
      .status(500)
      .json({ message: "Error fetching stories", error: error.message });
  }
};
