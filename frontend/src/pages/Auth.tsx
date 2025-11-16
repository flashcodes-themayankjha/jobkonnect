
import React, { useState, useEffect } from "react";
import SlidingAuth, { AuthMode } from "@/components/ui/auth/SlidingAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AuthPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);

  // sign in
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  // sign up
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [role, setRole] = useState<"job_seeker" | "employer" | null>(null);

  useEffect(() => {
    // Optionally pick up pending role after OAuth redirect
    const pending = localStorage.getItem("pendingRole");
    if (pending === "job_seeker" || pending === "employer") {
      setRole(pending);
      localStorage.removeItem("pendingRole");
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: siEmail,
        password: siPassword,
      });
      if (error) throw error;

      // fetch profile role to route
      const id = data.user?.id;
      if (id) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", id)
          .single();
        if (!profileError && profile?.role) {
          navigate(profile.role === "job_seeker" ? "/seeker-dashboard" : "/employer-dashboard");
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }

      toast.success("Signed in");
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast.error("Please select a role");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: suEmail,
        password: suPassword,
        options: {
          data: { full_name: suName, role },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;

      toast.success("Account created — check your email to confirm");
      setMode("signin");
    } catch (err: any) {
      toast.error(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple" | "linkedin") => {
    // store role for callback if available
    if (role) localStorage.setItem("pendingRole", role);
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin + "/" },
      });
    } catch (err: any) {
      toast.error(err.message || `OAuth failed (${provider})`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent to-background p-6">
      <div className="absolute top-6 right-6"><ThemeToggle /></div>

      <SlidingAuth
        mode={mode}
        setMode={setMode}
        signInEmail={siEmail}
        signInPassword={siPassword}
        onSignInEmailChange={setSiEmail}
        onSignInPasswordChange={setSiPassword}
        onSignIn={handleSignIn}
        signUpName={suName}
        signUpEmail={suEmail}
        signUpPassword={suPassword}
        role={role}
        onRoleSelect={(r) => setRole(r)}
        onSignUpNameChange={setSuName}
        onSignUpEmailChange={setSuEmail}
        onSignUpPasswordChange={setSuPassword}
        onSignUp={handleSignUp}
        onOAuth={handleOAuth}
        loading={loading}
      />
    </div>
  );
}
