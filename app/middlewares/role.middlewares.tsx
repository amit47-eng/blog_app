

export default function authorizeRole(...rest: string[]) {
  return function (req:any, res:any, next:any) {
    if (!rest.includes(req.user.role)) {
      res.status(401).json({ Message: "User is not allowed!!" });
      return;
    }
    next();
  };
}

