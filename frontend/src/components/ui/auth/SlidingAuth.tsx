
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { SiLinkedin } from "react-icons/si";

export type AuthMode = "signin" | "signup";

export default function SlidingAuth(props) {
  const isSignUp = props.mode === "signup";

  return (
    <div className="relative w-full max-w-5xl h-[650px] rounded-3xl shadow-2xl overflow-hidden bg-card mx-auto">

      {/* ---------------- Decorative Capsule Panel ---------------- */}
{/* ---------------- Decorative Capsule Panel ---------------- */}
<motion.div
  className="absolute z-10 pointer-events-none flex items-center justify-center"
  initial={false}
  animate={isSignUp ? { x: "18%" } : { x: "-18%" }}
  transition={{ type: "spring", stiffness: 120, damping: 16 }}
  style={{
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",

    // FIXED SIZE
    width: "35%",
    height: "70%",
  }}
>
  <motion.div
    className="absolute inset-0 flex flex-col items-center justify-center text-white px-10"
    initial={false}
    animate={
      isSignUp
        ? { borderRadius: "200px 0 0 200px" }
        : { borderRadius: "0 200px 200px 0" }
    }
    transition={{ duration: 0.45 }}
    style={{
      background: "linear-gradient(135deg, #4f46e5, #6d28d9)",
      boxShadow: "0 20px 40px rgba(79,70,229,0.15)",
    }}
  >
    {isSignUp ? (
      <>
        <h2 className="text-3xl font-bold mb-3">Hello Friend!</h2>
        <p className="text-center max-w-[240px] mb-6">
          Register to start your journey with us.
        </p>
        <Button
          variant="outline"
          className="text-white border-white hover:bg-white hover:text-primary"
          onClick={() => props.setMode("signin")}
        >
          Sign In
        </Button>
      </>
    ) : (
      <>
        <h2 className="text-3xl font-bold mb-3">Welcome Back!</h2>
        <p className="text-center max-w-[240px] mb-6">
          Login to continue where you left off.
        </p>
        <Button
          variant="outline"
          className="text-white border-white hover:bg-white hover:text-primary"
          onClick={() => props.setMode("signup")}
        >
          Sign Up
        </Button>
      </>
    )}
  </motion.div>
</motion.div>

      
      {/* ---------------- FORMS (Top Layer) ---------------- */}
      <div className="absolute inset-0 z-20 grid grid-cols-1 md:grid-cols-2 h-full">

        {/* SIGN IN FORM */}
        <div
          className={`
            flex items-center justify-center p-10 transition-opacity duration-500
            ${isSignUp ? "opacity-0 pointer-events-none" : "opacity-100"}
          `}
        >
          <form className="w-full max-w-sm" onSubmit={props.onSignIn}>
            <h2 className="text-3xl font-bold mb-6">Sign In</h2>

            <Label>Email</Label>
            <Input
              className="mb-4"
              type="email"
              value={props.signInEmail}
              onChange={(e) => props.onSignInEmailChange(e.target.value)}
            />

            <Label>Password</Label>
            <Input
              className="mb-6"
              type="password"
              value={props.signInPassword}
              onChange={(e) => props.onSignInPasswordChange(e.target.value)}
            />

            <Button className="w-full" disabled={props.loading}>
              {props.loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="flex gap-3 justify-center mt-6">
              <Button type="button" variant="outline" onClick={() => props.onOAuth?.("google")}>
                <FcGoogle size={20} />
              </Button>
              <Button type="button" variant="outline" onClick={() => props.onOAuth?.("apple")}>
                <FaApple size={20} />
              </Button>
              <Button type="button" variant="outline" onClick={() => props.onOAuth?.("linkedin")}>
                <SiLinkedin size={18} />
              </Button>
            </div>
          </form>
        </div>

        {/* SIGN UP FORM */}
        <div
          className={`
            flex items-center justify-center p-10 transition-opacity duration-500
            ${isSignUp ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <form className="w-full max-w-sm" onSubmit={props.onSignUp}>
            <h2 className="text-3xl font-bold mb-6">Create Account</h2>

            <div className="flex gap-3 mb-4">
              <Button
                type="button"
                variant={props.role === "job_seeker" ? "default" : "outline"}
                onClick={() => props.onRoleSelect("job_seeker")}
              >
                Job Seeker
              </Button>
              <Button
                type="button"
                variant={props.role === "employer" ? "default" : "outline"}
                onClick={() => props.onRoleSelect("employer")}
              >
                Employer
              </Button>
            </div>

            <Label>Name</Label>
            <Input
              className="mb-4"
              value={props.signUpName}
              onChange={(e) => props.onSignUpNameChange(e.target.value)}
            />

            <Label>Email</Label>
            <Input
              className="mb-4"
              type="email"
              value={props.signUpEmail}
              onChange={(e) => props.onSignUpEmailChange(e.target.value)}
            />

            <Label>Password</Label>
            <Input
              className="mb-6"
              type="password"
              value={props.signUpPassword}
              onChange={(e) => props.onSignUpPasswordChange(e.target.value)}
            />

            <Button className="w-full" disabled={!props.role || props.loading}>
              {props.loading ? "Creating..." : "Sign Up"}
            </Button>

            <div className="flex gap-3 justify-center mt-6">
              <Button type="button" variant="outline" onClick={() => props.onOAuth?.("google")}>
                <FcGoogle size={20} />
              </Button>
              <Button type="button" variant="outline" onClick={() => props.onOAuth?.("apple")}>
                <FaApple size={20} />
              </Button>
              <Button type="button" variant="outline" onClick={() => props.onOAuth?.("linkedin")}>
                <SiLinkedin size={18} />
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
