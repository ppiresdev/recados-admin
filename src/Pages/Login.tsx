import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import * as yup from "yup";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useDispatch } from "react-redux";
import {
  clearUserSuccess,
  userLogin,
  clearLoginStatus,
} from "../store/reducers/slices/UserSlice";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("O campo precisa conter um e-mail válido")
    .required("Campo obrigatório"),
  password: yup
    .string()
    .required("Campo obrigatório")
    .min(5, "A senha deve ter no mínimo 5 caracteres"),
});

type note = {
  id: string;
  content: string;
  status: boolean;
};

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const notifyUserNotFound = () => {
    toast.error("Usuário não encontrado!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const notifyEmptyFields = () => {
    toast.error("Preencha todos os campos!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleSubmit = () => {
    setIsLoading(true);
    loginSchema
      .validate(
        {
          email,
          password,
        },
        { abortEarly: false }
      )
      .then((validData) => {
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
          setIsLoading(false);
        });
      });
    login();
  };

  useEffect(() => {
    if (user.login_status !== "Usuário não encontrado!" && user.success) {
      localStorage.setItem("userLogged", "");
      localStorage.setItem("userLogged", JSON.stringify(user.login_status));

      dispatch(clearUserSuccess());
      dispatch(clearLoginStatus());
      navigate("/notes");
    }
    if (user.login_status === "Usuário não encontrado!") {
      notifyUserNotFound();
      dispatch(clearUserSuccess());
      dispatch(clearLoginStatus());
    }

    // return () => {
    //   dispatch(clearLoginStatus());
    // };
  }, [user]);

  const login = async () => {
    const myObject = {
      password,
      email,
    };

    // const {
    //   data,
    // }: AxiosResponse<
    //   {
    //     _id: string;
    //     _email: string;
    //     _password: string;
    //     _notes: note[];
    //   }[]
    // > = await axios.get(process.env.REACT_APP_URL + "users");

    // const userFound = data.find(
    //   (user) =>
    //     user._email === myObject.email && user._password === myObject.password
    // );

    // if (!email || !password) {
    //   notifyEmptyFields();
    //   return;
    // }
    // if (!userFound) {
    //   // return alert("Usuario não encontrado!");
    //   notifyUserNotFound();
    //   return;
    // }
    // console.log("===myObject====", myObject);
    // console.log("===USEr===", user);

    dispatch(userLogin(myObject));
  };

  const canBeSubmitted = !!email && !!password;
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap={2}
      > */}
      <Paper elevation={3}>
        <Box
          sx={{ p: 2 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap={2}
        >
          {user.loading && (
            <Typography variant="h5" align="center" color="red">
              Carregando...
            </Typography>
          )}

          <Typography variant="h4" align="center">
            Sistema de recados
          </Typography>
          <Typography variant="h6" align="center">
            Identifique-se
          </Typography>
          <TextField
            fullWidth
            label="E-mail"
            type="email"
            value={email}
            disabled={isLoading}
            error={!!emailError}
            helperText={emailError}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            onKeyDown={() => setEmailError("")}
          />
          <TextField
            fullWidth
            label="Senha"
            type="password"
            value={password}
            disabled={isLoading}
            error={!!passwordError}
            helperText={passwordError}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={() => setPasswordError("")}
          />
          <Button
            fullWidth
            variant="contained"
            disabled={!canBeSubmitted}
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
            Entrar
          </Button>
          <Box>
            <Link to={"/"}>
              <Typography variant="body1">Crie uma conta</Typography>
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
      </Paper>
      {/* </Box> */}
    </Box>
  );
};
