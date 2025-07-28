const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "İsim gerekli"],
    },
    email: {
      type: String,
      required: [true, "Email gerekli"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Şifre gerekli"],
    },
  },
  { timestamps: true }
);

// Şifreyi kaydetmeden önce hashle
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Şifre karşılaştırma fonksiyonu
userSchema.methods.comparePassword = async function (gelenSifre) {
  return await bcrypt.compare(gelenSifre, this.password);
};

module.exports = mongoose.model("User", userSchema);
