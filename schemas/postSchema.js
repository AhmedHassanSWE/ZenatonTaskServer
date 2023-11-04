const postSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    content: { type: "string" },
    imageUrl: { type: "string" },
    userId: { type: "string" },
    createdAt: { type: "object" },
  },
  required: ["title", "content", "imageUrl", "userId", "createdAt"],
};

module.exports = postSchema;
