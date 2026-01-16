import path from "path";
import util from "util";
import multer from "multer";

const maxSize = 20 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/../../storage/"));
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

const uploadFile = multer({
  storage,
  limits: { fileSize: maxSize },
}).single("file");

const fileMiddleware = util.promisify(uploadFile);

export default fileMiddleware;
