

export default async function subscribeUser(req, res) {
    try {
      const updateUser = await User.findByIdAndUpdate(req.user.id, {
        isSubscribed: true,
      });
      if (!updateUser) {
        return res.status(404).json({ Message: "Page not found!" });
      }
      res.status(200).json({ Message: "User is Subscribed" });
    } catch (err) {
      res.status(500).json({ Message: "Something went wrong", error: error });
    }
  }
  