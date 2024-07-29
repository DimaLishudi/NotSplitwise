import express from "express"
import path from "path"

export const router = express.Router()

const root = path.dirname(path.dirname(import.meta.dirname));
const event_path = path.join("src", "views", "eventByID.html");
// const public_path = path.join(root, "public");
// __dirname = __dirname.substring(0, __dirname.lastIndexOf("/"))

router.use("/events/:id", (req, resp) => {
    // console.log(root);
    // console.log(public_path);
    // console.log(event_path);
    resp.sendFile(event_path, {root});
});
