import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

//tested
const createPost = async (req, res) => {
  try {
    const { title, content, tags, userId, criticality } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (!title || !content) {
      throw new Error("All fields are required");
    }

    // Check if media is provided
    if (!req.file) {
      throw new Error("Media is required");
    }

    // Upload media to Cloudinary
    const mediaLocalPath = req?.file?.path;
    const media = await uploadOnCloudinary(mediaLocalPath);

    if (!media) {
      throw new Error("Unable to upload media");
    }

    // Create the post with media
    const post = await Post.create({
      title,
      content,
      media: {
        public_id: media.public_id,
        secure_url: media.secure_url,
      },
      tags: tags,
      user: userId,
      comments: [],
      criticality,
      verifiedBy: [],
      disapprovedBy: [],
      location: user.location,
    });

    // Fetch the newly created post and send response
    const populatedPost = await Post.findById(post._id);

    //TODO: if criticality is severe or user is verified user then only send notification immediately

    return res.status(200).send({
      success: true,
      message: "Successfully added post",
      data: populatedPost,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
      data: {},
    });
  }
};

//tested
const likePost = async (req, res) => {
  try {
    const { postId } = req.body;
    console.log("Post id ", req.body);

    if (!postId) {
      throw new Error("Post ID is required");
    }

    // Like Post
    let post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    post.likes += 1;
    await post.save();
    post = await Post.findById(postId);
    res
      .status(200)
      .send({ success: true, message: "Post liked successfully", data: post });
  } catch (error) {
    res.send({ success: false, message: error.message, data: {} });
  }
};

//tested
const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    if (!postId) {
      throw new Error("Post ID is required");
    }
    // Delete Post
    const post = await Post.findByIdAndDelete(postId);
    res.send({
      success: true,
      message: "Post deleted successfully",
      data: post,
    });
  } catch (error) {
    res.send({ success: false, message: error.message, data: {} });
  }
};

//tested
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: error.message, data: {} });
  }
};

//tested
const getPostsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log('UserId ' , req.query);
    if (!userId) throw new Error("User ID is required");

    const posts = await Post.find({ user: userId });
    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: error.message, data: {} });
  }
};

//tested
const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) throw new Error("Post ID is required");

    const post = await Post.findById(postId);
    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: error.message, data: {} });
  }
};

const addVerification = async (req, res) => {
  const { severity, postId, userId } = req.body;

  try {
    if (!userId) throw new Error("UserId is required");

    let user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    if (user.credit < 5) throw new Error("User is unauthorized to verify");

    let post = await Post.findById(postId);

    if (!post) throw new Error("Post not found");

    if (post.status === "Disapproved")
      throw new Error("Cannot verify disapproved posts");

    if (post.verifiedBy.includes(userId))
      throw new Error("Already verified by you");

    post.verifiedBy.push(userId);
    post.criticality = severity;

    if (post.verifiedBy.length === 3) {
      // TODO : send notification
      //send postId and verifies user's severity
      const users = await User.find({ _id: { $in: post.verifiedBy } });
      for (let i = 0; i < users.length; i++) {
        users[i].credit += 1;
        await users[i].save();
      }

      post.status = "Verified";
    }
    await post.save();
    post = await Post.findById(post._id);
    res.status(200).json({
      success: true,
      message: "Successfully approved post",
      data: post,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message, data: {} });
  }
};

const addDisapproval = async (req, res) => {
  const { postId, userId } = req.body;

  try {
    if (!userId) throw new Error("UserId is required");
    let user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    if (user.credit < 5) throw new Error("User is unauthorized to disapprove");

    let post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");
    if (post.status === "Verified")
      throw new Error("Cannot disapprove verified posts");

    if (post.disapprovedBy.find((item) => item === userId))
      throw new Error("Already disapproved by you");

    post.disapprovedBy.push(userId);
    //  post.criticality = severity ;

    if (post.disapprovedBy.length === 2) {
      // TODO : send notification
      //send postId and verifies user's severity
      const users = await User.find({ _id: { $in: post.verifiedBy } });
      for (let i = 0; i < users.length; i++) {
        users[i].credit -= 1;
        await users[i].save();
      }

      post.status = "Disapproved";
    }
    await post.save();
    post = await Post.findById(post._id);
    res.status(200).json({
      success: true,
      message: "Successfully disapproved post",
      data: post,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message, data: {} });
  }
};

export {
  createPost,
  deletePost,
  likePost,
  getAllPosts,
  getPostsByUserId,
  getPostById,
  addVerification,
  addDisapproval,
};
