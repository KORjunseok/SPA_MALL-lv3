const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema({
  nickname: { // nickname 필드
    type: String,
    required: true,
    unique: true,
  },
  password: { // password 필드
    type: String,
    required: true,
  },
});

// 가상의 signupId 값을 할당
signupSchema.virtual("signupId").get(function () {
  return this._id.toHexString();
});

// signup 정보를 JSON으로 형변환 할 때 virtual 값이 출력되도록 설정
signupSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("signup", signupSchema);