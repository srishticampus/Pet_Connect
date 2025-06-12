import express from "express"
import multer from "multer";
import tf from "@tensorflow/tfjs-node";
import sharp from "sharp";
import path from "path";
import fs from "fs";

// Express setup
const router = express.Router();
// Multer setup (for file uploads)
const upload = multer({ dest: "uploads/" });

// Reverse mapping
const reverseMapping = {
  0: { breed: "abyssinian", type: "cat" },
  1: { breed: "american_bulldog", type: "dog" },
  2: { breed: "american_pit_bull_terrier", type: "dog" },
  3: { breed: "basset_hound", type: "dog" },
  4: { breed: "beagle", type: "dog" },
  5: { breed: "bengal", type: "cat" },
  6: { breed: "birman", type: "cat" },
  7: { breed: "bombay", type: "cat" },
  8: { breed: "boxer", type: "dog" },
  9: { breed: "british_shorthair", type: "cat" },
  10: { breed: "chihuahua", type: "dog" },
  11: { breed: "egyptian_mau", type: "cat" },
  12: { breed: "english_cocker_spaniel", type: "dog" },
  13: { breed: "english_setter", type: "dog" },
  14: { breed: "german_shorthaired", type: "dog" },
  15: { breed: "great_pyrenees", type: "dog" },
  16: { breed: "havanese", type: "dog" },
  17: { breed: "japanese_chin", type: "dog" },
  18: { breed: "keeshond", type: "dog" },
  19: { breed: "leonberger", type: "dog" },
  20: { breed: "maine_coon", type: "cat" },
  21: { breed: "miniature_pinscher", type: "dog" },
  22: { breed: "newfoundland", type: "dog" },
  23: { breed: "persian", type: "cat" },
  24: { breed: "pomeranian", type: "dog" },
  25: { breed: "pug", type: "dog" },
  26: { breed: "ragdoll", type: "cat" },
  27: { breed: "russian_blue", type: "cat" },
  28: { breed: "saint_bernard", type: "dog" },
  29: { breed: "samoyed", type: "dog" },
  30: { breed: "scottish_terrier", type: "dog" },
  31: { breed: "shiba_inu", type: "dog" },
  32: { breed: "siamese", type: "cat" },
  33: { breed: "sphynx", type: "cat" },
  34: { breed: "staffordshire_bull_terrier", type: "dog" },
  35: { breed: "wheaten_terrier", type: "dog" },
  36: { breed: "yorkshire_terrier", type: "dog" },
};

let model;

// Load model once on server start
(async () => {
  try {
    model = await tf.loadLayersModel("file://controllers/ml/model/tfjs_model/model.json");
    console.log("Model loaded");
  } catch (error) {
    console.error("Failed to load model:", error);
  }
})();

// Prediction endpoint
router.post("/predict", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imagePath = req.file.path;
    const buffer = await sharp(imagePath).resize(180, 180).toBuffer();

    const tensor = tf.node.decodeImage(buffer, 3).expandDims(0).div(255.0);

    const prediction = model.predict(tensor);
    const data = prediction.dataSync();
    const maxIndex = data.indexOf(Math.max(...data));
    const confidence = data[maxIndex];

    const result = {
      breed: reverseMapping[maxIndex].breed,
      type: reverseMapping[maxIndex].type,
      confidence: confidence,
    };

    // Clean up
    fs.unlinkSync(imagePath);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message,modelloaded:!!model });
  }
});
export default router;

