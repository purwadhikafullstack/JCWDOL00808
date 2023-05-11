// Import Multer
const { multerUpload } = require("./../lib/multer");

// Import deleteFiles
const deleteFiles = require("./../helper/deleteFiles");

//function untuk mengupload profile_picture
const uploadImages = (req, res, next) => {
  const multerResult = multerUpload.fields([{ name: "profile_picture", maxCount: 1 }]);

  multerResult(req, res, function (err) {
    try {
      if (err) throw err;

      req.files.profile_picture.forEach((value) => {
        //adjust max file sizes in bytes
        if (value.size > 5000000)
          throw {
            message: `${value.originalname} size too large`,
          };
      });

      next();
    } catch (error) {
      if (req.files.profile_picture) {
        deleteFiles(req.files.profile_picture);
      }
      res.status(400).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  });
};

//function untuk mengupload imageUrl dari products
const uploadImagesProduct = (req, res, next) => {
  const multerResult = multerUpload.fields([{ name: "imageUrl", maxCount: 1 }]);
  multerResult(req, res, function (err) {
    try {
      if (err) throw err;

      req.files.imageUrl.forEach((value) => {
        //adjust max file sizes in bytes
        if (value.size > 700000)
          throw {
            message: `${value.originalname} size too large`,
          };
      });

      next();
    } catch (error) {
      if (req.files.imageUrl) {
        deleteFiles(req.files.imageUrl);
      }
      res.status(400).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  });
};

// mengupload proof of payment
const uploadPaymentProof = (req, res, next) => {
  const multerResult = multerUpload.fields([{ name: "payment_proof", maxCount: 1 }]);
  multerResult(req, res, function (err) {
    try {
      if (err) throw err;

      req.files.payment_proof.forEach((value) => {
        //adjust max file sizes in bytes
        if (value.size > 700000)
          throw {
            message: `${value.originalname} size too large`,
          };
      });

      next();
    } catch (error) {
      if (req.files.payment_proof) {
        deleteFiles(req.files.payment_proof);
      }
      res.status(400).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  });
};

module.exports = { uploadImagesProduct, uploadImages, uploadPaymentProof };
