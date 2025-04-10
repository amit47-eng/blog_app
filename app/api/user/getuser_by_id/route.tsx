import User from "@/model/user.model";

export default function getUserById(req:any, res:any) {
    let { id } = req.params;
    User.findOne({ _id: id })
      .then((response:any) => {
        res.status(200).json({
          Message: "User is fetched!! Successfully!",
          response: response,
        });
      })
      .catch((error:any) => {
        res.status(500).json({ Message: "Something went wrong", error: error });
      });
  }