import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import "./SignForm.scss";

const formSchema = z.object({
  email: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(6, "Minst 6 tecken"),
});

type FormData = z.infer<typeof formSchema>;

const SignForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log("✅ Sign-in data:", data);
    // TODO: login logic
  };

  return (
    <div className="signform">
      <div className="signform__card">
        <h1 className="signform__title">Logga in</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="signform__form">
          <div className="signform__group">
            <label htmlFor="email">E-post</label>
            <input
              id="email"
              type="email"
              placeholder="namn@exempel.se"
              {...register("email")}
            />
            {errors.email && (
              <p className="signform__error">{errors.email.message}</p>
            )}
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
              <button
                type="button"
                className="signform__toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
            {errors.password && (
              <p className="signform__error">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="signform__button"
            disabled={isSubmitting}
          >
            Logga in
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignForm;
