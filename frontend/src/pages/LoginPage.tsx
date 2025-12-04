import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/Auth/LoginForm";
import { Layout } from "../components/Layout/Layout";
import { useAuthStore } from "../stores/authStore";

export function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoginForm />
      </div>
    </Layout>
  );
}
