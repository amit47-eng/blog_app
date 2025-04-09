import User from "../../../../model/user.model"; 
export default function DeleteUser(req:any, res:any) {
    let useremail = req.body.email;
    User.deleteMany({ email: useremail })
        .then((response:any) => {
            res.status(200).json({ message: "Users deleted successfully", response: response });
        })
        .catch((err:any) => {
            console.error(err); // Log the error properly
            res.status(500).json({ message: "Something's wrong", error: err });
        });
}