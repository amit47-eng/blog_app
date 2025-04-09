import Article from "@/model/article.model";

export default function GetPosts(req:any, res:any) {
  Article.find()
      .populate({ path: "comments" })
      .select("-comments")
      .then((response:any) => {
        res.status(200).json({
          Message: "Posts are Successfully fetched!",
          response: response,
        });
      })
      .catch((error:any) => {
        res.status(500).json({ Message: "Something went wrong", error: error });
      });
  }