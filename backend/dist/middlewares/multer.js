import multer from "multer";
import { v4 as uuid } from "uuid";
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads");
    },
    filename(req, file, callback) {
        const newfilename = uuid();
        const extension = file.originalname.split(".").pop();
        callback(null, `${newfilename}.${extension}`);
    },
});
export const singleUpload = multer({ storage }).single("photo");
