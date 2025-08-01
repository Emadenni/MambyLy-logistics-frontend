import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./SignForm.scss";
import logo240 from "../../assets/logoDash-240.webp";

type FormData = z.infer<typeof formSchema>;

interface SignFormProps {
  onClose: () => void;
}

const formSchema = z.object({
  email: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(6, "Minst 6 tecken"),
});

const SignForm: React.FC<SignFormProps> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  const onSubmit = (data: FormData) => {
    console.log("✅ Sign-in data:", data);
    // TODO: login logic
  };

  return (
    <div className="signform__wrapper">
      <button className="signform__close" onClick={onClose}>
        ✕
      </button>

      <header className="signform__header">
        <img src={logo240} alt="EnkelDash logo"  className="enkelDash-logo-login"/>
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
        </div>
      </div>

      <div className="signform__background-accent" />
    </div>
  );
};

export default SignForm;
