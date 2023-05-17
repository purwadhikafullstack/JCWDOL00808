// Import Multer
const multer = require("multer");
// Import File System
const fs = require("fs");

// 1. Setup Disk Storage & Filename, change accordingly
let defaultPath = "src/public";
var storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // console.log(file);
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
    if (file.fieldname === "payment_proof") {
      cb(null, `${defaultPath}/${file.fieldname}`); // public/payment_proof
    }
  },
  filename: (req, file, cb) => {
    cb(null, "PIMG" + "-" + Date.now() + Math.round(Math.random() * 1000000000) + "." + file.mimetype.split("/")[1]); // [image, png]
  },
});

// 2. Setup File Filter
var fileFilter = (req, file, cb) => {
  var allowedExtensions = [".jpg", ".jpeg", ".png"]; // Daftar ekstensi yang diperbolehkan

  // Memeriksa ekstensi file
  var extension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf("."));
  if (allowedExtensions.includes(extension)) {
    // File diperbolehkan
    cb(null, true);
  } else {
    // File tidak diperbolehkan
    cb(new Error("File Must Be Image (JPG, JPEG, PNG)!"));
  }
};

exports.multerUpload = multer({ storage: storage, fileFilter: fileFilter });
