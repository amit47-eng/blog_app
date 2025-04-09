var jwt = require("jsonwebtoken");


 export default async function isLoggedIn(req:any, res:any, next:any) {
  try {
    let { myToken } = req.cookies;
    if (!myToken) {
      res.status(401).json({
        message: "Kindly login!",
      });
      return;
    }

    const decoded = await jwt.verify(myToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
}


