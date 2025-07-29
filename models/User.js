const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "İsim gerekli"],
      minlength: [3, "İsim en az 3 karakter olmalıdır"],
    },
    email: {
      type: String,
      required: [true, "Email gerekli"],
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Lütfen geçerli bir email adresi giriniz",
      },
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Lütfen geçerli bir email adresi giriniz"],
    },
    password: {
      type: String,
      required: [true, "Şifre gerekli"],
      minlength: [6, "Şifre en az 6 karakter olmalıdır"],
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
