import db from "../orm/models/index.js";
const { SignatureStamp } = db;

class SignatureStampDAO {
  static async getSignatureStamp() {
    return await SignatureStamp.findOne();
  }

  static async createOrUpdateSignature(filePath) {
    let stamp = await SignatureStamp.findOne();
    if (stamp) {
      stamp.filePath = filePath;
      await stamp.save();
    } else {
      stamp = await SignatureStamp.create({ filePath });
    }
    return stamp;
  }
}

export default SignatureStampDAO;
