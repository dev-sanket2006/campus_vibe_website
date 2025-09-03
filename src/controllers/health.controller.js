export const healthCheck = (req, res) => {
  res.json({ status: "ok", message: "Campus Vibe API is healthy 🚀" });
};
