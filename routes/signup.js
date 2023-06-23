const express = require("express");
const router = express.Router();
const Signup = require("../schemas/signup.js");

// 회원가입 API  
router.post("/signup", async (req, res) => {
  try {
  const { nickname, password, confirm } = req.body;

  // 닉네임 형식이 일치하지 않는 경우 소문자(a-z), 대문자(A-Z), 숫자(0-9)로 구성. 4~16자로 유효성. 
  const nicknameRegex = /^[a-zA-Z0-9]{4,16}$/; 
  if (!nicknameRegex.test(nickname)) {
    res.status(412).json({
      errorMessage: "닉네임의 형식이 일치하지 않습니다.",
    });
    return;
  }
  // 패스워드와 확인이 일치하지 않는 경우 
  if (password !== confirm) {
    res.status(412).json({
      errorMessage: "패스워드가 일치하지 않습니다.",
    });
    return;
  }
  // 닉네임 형식과 같은 방법으로 패스워드 형식 구성 
  const passwordRegex = /^[a-zA-Z0-9]{4,16}$/;
  if (!passwordRegex.test(password)) {
    res.status(412).json({
      errorMessage: "패스워드 형식이 일치하지 않습니다.",
    });
    return;
  }
  // 패스워드에 닉네임이 포함된 경우 IF문 구성  
  if (password.includes(nickname)) {
    res.status(412).json({
      errorMessage: "패스워드에 닉네임이 포함되어 있습니다.",
    });
    return;
  }
  // 닉네임에 동일한 데이터가 있는지 확인
  const existsSignups = await Signup.findOne({
    $or: [{ nickname }],
  });
  if (existsSignups) {
    res.status(412).json({
      errorMessage: "중복된 닉네임입니다.",
    });
    return;
  }
  // 회원가입 성공과 예외 오류 
  const signup = new Signup({ nickname, password });
  await signup.save();

  res.status(201).send({ message: "회원 가입에 성공하였습니다."});
 } catch (error) {
    return res.status(400).json({ error, message: "요청한 데이터 형식이 올바르지 않습니다." });
  }
});

module.exports = router;