import { User ,Articale } from "module";

export default async function DeletePostById(req, res) {

    let { id } = req.user;
    let { postId } = req.params;
    let user = await User.findOne({ _id: id });
    if(!user.article.includes(postId)){
      return res.status(400).json({Message: "You are not authorized to delete this post"})
    }
    Article.findOne
    let post = await Article.findOneAndDelete({ _id: postId });
   
  
  }