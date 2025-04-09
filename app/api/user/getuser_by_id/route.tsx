

export default function getUserById(req, res) {
    let { id } = req.params;
    User.findOne({ _id: id })
      .then((response) => {
        res.status(200).json({
          Message: "User is fetched!! Successfully!",
          response: response,
        });
      })
      .catch((error) => {
        res.status(500).json({ Message: "Something went wrong", error: error });
      });
  }