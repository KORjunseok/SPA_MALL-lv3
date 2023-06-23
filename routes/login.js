const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const Signup = require("../schemas/signup");

// 로그인 API
router.post("/login", async (req, res) => {
  try {
  const { nickname, password } = req.body;

  const signup = await Signup.findOne({ nickname });

  // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다.
  if (!signup || password !== signup.password) {
    res.status(412).json({
      errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
    });
    return;
  }

  const token = jwt.sign(
    { signupId: signup.signupId },
    "custom-secret-key",
  );

	res.cookie("loginorization", `Bearer ${token}`); // JWT를 Cookie로 할당합니다!
  res.status(200).json({ token }); // JWT를 Body로 할당합니다!
} catch (error) {
  return res.status(400).json({ error, message: "로그인에 실패하였습니다." });
}
});

module.exports = router;