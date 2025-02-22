import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMessageDialog } from "../contexts/MessageDialogContext";
import { useUser } from "../contexts/UserContext";

export default function Login() {
  const { loginUser } = useUser();
  const navigate = useNavigate();
  const { showMessage } = useMessageDialog();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await loginUser(email, password);
    if (response.success) {
      navigate("/chantiers");
    } else {
      showMessage("error", response.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-96 p-10 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Connexion</h2>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-3"
        />
        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-4"
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
