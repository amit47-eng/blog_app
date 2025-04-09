

export default function GetUsers(req, res) {
    User.find(req.body)
      .then((response) => {
        res.status(200).json({ message: "Users retrieved successfully", response: response });
      })
      .catch((err) => {
        res.status(500).json({ message: "Something went wrong", error: err });
      });
  }
  