"use client";

import "@styles/Register.scss";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";


const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      [name]: name === "profileImage" ? files[0] : value,
    });
  };

  const router = useRouter();

  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const registerForm = new FormData();

      for (var key in formData) {
        registerForm.append(key, formData[key]);
      }

      const response = await fetch("/api/register/", {
        method: "POST",
        body: registerForm,
      });

      if (response.ok) {
        router.push("/login");
      }
    } catch (err) {
      console.log("Registration failed", err.message);
    }
  };

  const loginWithGoogle = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="register">

      <div className="register_content">
        <form className="register_content_form" onSubmit={handleSubmit}>

        </form>
        <button
          type="button"
          onClick={loginWithGoogle}
          className="google"
        >
          <p>Log In with Google</p>
          <FcGoogle />
        </button>
        <a href="/login">Already have an account? Log In Here</a>
        <Link href="/">Go Back</Link>
      </div>
    </div>
  );
};

export default Register;
