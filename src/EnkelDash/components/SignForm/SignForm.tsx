import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signIn, confirmSignIn, fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { useAuthStore } from "../../../store/useAuthStore"; // adatta se serve
import "./SignForm.scss";
import logo240 from "../../assets/logoDash-240.webp";

const formSchema = z.object({
  email: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(6, "Minst 6 tecken"),
});
type FormData = z.infer<typeof formSchema>;

interface SignFormProps {
  onClose: () => void;
}

const SignForm: React.FC<SignFormProps> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  const [showPassword, setShowPassword] = useState(false);
  const [needsNewPassword, setNeedsNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const setIsAuthenticated = useAuthStore((s) => s.setIsAuthenticated);
  const setAdminId = useAuthStore((s) => s.setAdminId);

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, []);

  async function finalizeLogin() {
    const { tokens } = await fetchAuthSession();
    const accessToken = tokens?.accessToken?.toString();
    if (!accessToken) throw new Error("No access token");

    const me = await getCurrentUser().catch(() => null);
    const sub = (me as any)?.userId ?? null;

    sessionStorage.setItem("token", accessToken);
    if (sub) sessionStorage.setItem("adminId", sub);
    setIsAuthenticated(true);
    setAdminId(sub ?? null);

    onClose?.();
    navigate("/enkel-dash/dashboard", { replace: true });
  }

  const onSubmit = async (data: FormData) => {
    try {
      setErrMsg("");
      const res = await signIn({ username: data.email, password: data.password });

      if (res.nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
        setNeedsNewPassword(true);
        return;
      }

      await finalizeLogin();
    } catch (err: any) {
      const code = err?.name || err?.code;
      const msg =
        code === "UserNotFoundException" ? "Användaren hittades inte"
        : code === "NotAuthorizedException" ? "Fel e-post eller lösenord"
        : code === "UserNotConfirmedException" ? "Kontot är inte bekräftat"
        : err?.message || "Ett fel uppstod. Försök igen.";
      setErrMsg(msg);
      console.error(err);
    }
  };

  const onSubmitNewPassword = async () => {
    try {
      setErrMsg("");
      if (!newPassword || newPassword.length < 6) {
        setErrMsg("Minst 6 tecken");
        return;
      }
      await confirmSignIn({ challengeResponse: newPassword });
      await finalizeLogin();
    } catch (err: any) {
      const msg = err?.message || "Ett fel uppstod vid lösenordsbyte.";
      setErrMsg(msg);
      console.error(err);
    }
  };

  return (
    <div className="signform__wrapper">
      <button className="signform__close" onClick={onClose}>✕</button>

      <header className="signform__header">
        <img src={logo240} alt="EnkelDash logo" className="enkelDash-logo-login" />
      </header>

      <div className="signform__container">
        <div className="signform__card">
          <h2>Logga in på din dashboard</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="signform__form">
            <div className="signform__group">
              <label htmlFor="email">E-post</label>
              <input id="email" type="email" placeholder="namn@exempel.se" {...register("email")} />
              {errors.email && <p className="signform__error">{errors.email.message}</p>}
            </div>

            <div className="signform__group">
              <label htmlFor="password">Lösenord</label>
              <div className="signform__password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                />
                <span
                  className="signform__toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  role="button"
                  tabIndex={0}
                  aria-label="Visa lösenord"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
              {errors.password && <p className="signform__error">{errors.password.message}</p>}
            </div>

            <button type="submit" className="signform__button" disabled={isSubmitting}>
              Logga in
            </button>
          </form>

          {needsNewPassword && (
            <div className="signform__group" style={{ marginTop: 16 }}>
              <label htmlFor="newPassword">Nytt lösenord</label>
              <input
                id="newPassword"
                type="password"
                placeholder="Minst 6 tecken"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button type="button" className="signform__button" onClick={onSubmitNewPassword} style={{ marginTop: 8 }}>
                Spara nytt lösenord
              </button>
            </div>
          )}

          {errMsg && <p className="signform__error" role="alert" style={{ marginTop: 12 }}>{errMsg}</p>}
        </div>
      </div>

      <div className="signform__background-accent" />
    </div>
  );
};

export default SignForm;
