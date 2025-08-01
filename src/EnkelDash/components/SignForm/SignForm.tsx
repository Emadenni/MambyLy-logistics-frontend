import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import "./SignForm.scss";

const formSchema = z.object({
  email: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(6, "Minst 6 tecken"),
});

type FormData = z.infer<typeof formSchema>;

const SignForm: React.FC = () => {
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
        <h1 className="signform__title">Välkommen</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="signform__form">
          <div className="signform__group">
            <label htmlFor="email">E-post</label>
            <input
              id="email"
              type="email"
              placeholder="namn@exempel.se"
              {...register("email")}
            />
            {errors.email && <p className="signform__error">{errors.email.message}</p>}
          </div>

          <div className="signform__group">
            <label htmlFor="password">Lösenord</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && <p className="signform__error">{errors.password.message}</p>}
          </div>

          <button type="submit" className="signform__button" disabled={isSubmitting}>
            Logga in
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignForm;
