import * as authService from "../services/authService.js";

// 🔹 Register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, year, branch, section } = req.body;

    // validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const user = await authService.registerUser(
      name,
      email,
      password,
      role,
      year,
      branch,
      section
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Register Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Registration failed. Please try again later.",
    });
  }
};

// 🔹 Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const { token, user } = await authService.loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);

    return res.status(401).json({
      success: false,
      message: error.message || "Invalid email or password",
    });
  }
};
