// Import Multer
const multer = require("multer");
// Import File System
const fs = require("fs");

// 1. Setup Disk Storage & Filename, change accordingly
let defaultPath = "public";
var storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    console.log(file);
    // Check Directory (Exist or Not)
    let isDirectoryExist = fs.existsSync(`${defaultPath}/${file.fieldname}`);

    if (!isDirectoryExist) {
      await fs.promises.mkdir(`${defaultPath}/${file.fieldname}`, {
        recursive: true,
      });
    }

    // To Create 'public/pdf' or 'public/images'
    if (file.fieldname === "files") {
      cb(null, `${defaultPath}/${file.fieldname}`); // public/files
    }
    if (file.fieldname === "profile_picture") {
      cb(null, `${defaultPath}/${file.fieldname}`); // public/profile_picture
    }
    if (file.fieldname === "imageUrl") {
      cb(null, `${defaultPath}/${file.fieldname}`); // public/imageUrl
    }
    if (file.fieldname === "profile_picture") {
      cb(null, `${defaultPath}/${file.fieldname}`); // public/profile_picture
    }
  },
  filename: (req, file, cb) => {
    cb(null, "PIMG" + "-" + Date.now() + Math.round(Math.random() * 1000000000) + "." + file.mimetype.split("/")[1]); // [image, png]
  },
});

// 2. Setup File Filter
var fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    // [image, png]
    // Accept
    cb(null, true);
  } else if (file.mimetype.split("/")[0] !== "image") {
    // Reject
    cb(new Error("File Must Be Image!"));
  }
};

exports.multerUpload = multer({ storage: storage, fileFilter: fileFilter });
