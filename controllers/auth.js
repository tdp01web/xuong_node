import User from "../models/User.js";
import { registerSchema } from "../validations/auth.js";
import bcryptjs from "bcryptjs";

export const register = async (req, res) => {
  try {
    /**
     * 1. Kiem tra du lieu dau vao
     * 2. Kiem tra email da ton tai chua?
     * 3. Ma hoa mat khau
     * 4. Tao user moi
     * 5. Thong bao thanh cong
     */

    const { email, password } = req.body;

    // if (email === "" || password === "") {
    //   return res
    //     .status(400)
    //     .json({ message: "Email va password khong duoc de trong!" });
    // }

    const { error } = registerSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((item) => item.message);
      return res.status(400).json({ messages: errors });
    }

    // ? B2: Kiem tra email da ton tai chua?
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({ message: "Email da ton tai!" });
    }

    // B3: Ma hoa mat khau

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    // B4: Tao user moi

    const user = await User.create({ ...req.body, password: hashPassword });
    user.password = undefined;
    return res.status(201).json({
      message: "Dang ky thanh cong!",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    /**
     * 1. Kiểm tra dữ liệu đầu vào
     * 2. Tìm người dùng trong cơ sở dữ liệu
     * 3. So sánh mật khẩu
     * 4. Tạo và trả về mã thông báo
     */

    const { email, password } = req.body;

    // Bước 1: Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email và mật khẩu." });
    }

    // Bước 2: Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    // Bước 3: So sánh mật khẩu
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng." });
    }

    // Bước 4: Tạo và trả về mã thông báo
    // Ở đây bạn có thể sử dụng JWT hoặc một phương thức xác thực khác.
    // Trong ví dụ này, tôi sẽ sử dụng một ví dụ đơn giản trả về thông báo đăng nhập thành công.
    return res.status(200).json({ message: "Đăng nhập thành công." });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};
