import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

type CreateUserResponse = {
  id: string;
  email: string;
  password: string;
};

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("O campo precisa conter uma email válido")
    .required("Campo obrigatório"),
  password: yup
    .string()
    .min(5, "A senha deve ter no mínimo 5 caracteres")
    .required("Campo obrigatório"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "As senhas devem ser iguais"),
});

const notify = () => {
  toast.success("Usuário criado com sucesso!", {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
const notifyEmailAlreadyUsed = () => {
  toast.error("E-mail já em foi usado. Escolha outro!", {
    position: "top-center",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

async function createUser(email: string, password: string) {
  try {
    const { data, status } = await axios.post<CreateUserResponse>(
      process.env.REACT_APP_URL + "user",
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("STATUS", status);

    if (status === 201) {
      notifyEmailAlreadyUsed();
    }

    if (status === 200) {
      notify();
    }

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
}

export const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const clearFields = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = () => {
    setIsLoading(true);
    loginSchema
      .validate(
        {
          email,
          password,
          confirmPassword,
        },
        { abortEarly: false }
      )
      .then((validData) => {
        console.log(
          validData.email,
          validData.password,
          validData.confirmPassword
        );
        setIsLoading(false);
      })
      .catch((errors: yup.ValidationError) => {
        errors.inner.forEach((error) => {
          if (error.path === "email") {
            setEmailError(error.message);
          }
          if (error.path === "password") {
            setPasswordError(error.message);
          }
          if (error.path === "confirmPassword") {
            setConfirmPasswordError(error.message);
          }
          setIsLoading(false);
        });
      });

    createUser(email, password);
    clearFields();
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        width="15%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap={2}
      >
        <Typography variant="h4" align="center">
          Sistema de recados
        </Typography>
        <Typography variant="h5" align="center">
          Crie sua conta
        </Typography>
        <TextField
          fullWidth
          label="E-mail"
          type="email"
          name="email"
          value={email}
          disabled={isLoading}
          error={!!emailError}
          helperText={emailError}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={() => setEmailError("")}
        />
        <TextField
          fullWidth
          label="Senha"
          type="password"
          name="password"
          id="password"
          value={password}
          disabled={isLoading}
          error={!!passwordError}
          helperText={passwordError}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={() => setPasswordError("")}
        />
        <TextField
          fullWidth
          label="Repita a Senha"
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={confirmPassword}
          disabled={isLoading}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={() => setConfirmPasswordError("")}
        />
        <Button
          fullWidth
          variant="contained"
          disabled={isLoading}
          onClick={handleSubmit}
          endIcon={
            isLoading ? (
              <CircularProgress
                variant="indeterminate"
                color="inherit"
                size={20}
              />
            ) : undefined
          }
        >
          Criar Conta
        </Button>
        <Box>
          <Link to={"/login"}>
            <Typography variant="body1">Já possui uma conta?</Typography>
          </Link>
        </Box>
      </Box>

      <ToastContainer
        theme="colored"
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Box>
  );
};
