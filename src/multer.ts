import multer from "multer";
const imageExtentions = ["jpg", "jpeg", "png", "gif"];
const documentExtentions = ["pdf", "ppt", "pptx", "docx", "text"];
const videoExtentions = ["mp4", "mkv"];
const musicExtentions = ["mp3"];

function selectMediaFolder(extention: string) {
  if (documentExtentions.includes(extention)) return "Documents";
  else if (imageExtentions.includes(extention)) return "Images";
  else if (musicExtentions.includes(extention)) return "Music";
  else if (videoExtentions.includes(extention)) return "Videos";
  else return "Others";
}

export const imageUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const fileExtention =
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      const folder = selectMediaFolder(fileExtention);
      return cb(null, `public/uploads/multimedia-messages/${folder}`);
    },
    filename: (req, file, cb) => {
      return cb(null, `${Date.now()}--${file.originalname}`);
    },
  }),
});
