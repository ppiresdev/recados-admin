import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import axios, { AxiosResponse } from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Note {
  id: string;
  content: string;
  status: boolean;
}

export const Notes = () => {
  const userLogged = JSON.parse(localStorage.getItem("userLogged") as string);
  const [notesList, setNotesList] = useState<Note[]>();
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState("");
  const [hasUpdatedNotesList, setHasUpdatedNotesList] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [noteIdToEdit, setNoteIdToEdit] = useState("");
  const [noteContentToEdit, setNoteContentToEdit] = useState("");
  const [value, setValue] = React.useState("");
  const [contentFilter, setContentFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getNotesList = async () => {
      const { data }: AxiosResponse<Note[]> = await axios.get(
        process.env.REACT_APP_URL + `user/${userLogged}/notes`
      );
      setNotesList(data);
    };

    if (hasUpdatedNotesList) {
      getNotesList();
      setHasUpdatedNotesList(false);
    }
  }, [hasUpdatedNotesList, notesList, userLogged]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilter((event.target as HTMLInputElement).value);
  };

  const handleSubmit = async () => {
    if (isEdit) {
      const response = await axios.put(
        process.env.REACT_APP_URL + `note/${noteIdToEdit}`,
        {
          content: note,
        }
      );
      if ((response.status = 200)) {
        notify();
      }

      setIsEdit(false);
    }
    if (!isEdit) {
      const response = await axios.post(
        process.env.REACT_APP_URL + `user/${userLogged}/notes`,
        {
          content: note,
        }
      );
      if ((response.status = 200)) {
        notify();
      }
    }
    setNote("");
    setHasUpdatedNotesList(true);
  };

  const changeStatus = async (status: boolean, noteId: string) => {
    const response = await axios.put(
      process.env.REACT_APP_URL + `note/${noteId}`,
      {
        status: !status,
      }
    );
    if ((response.status = 200)) {
      setHasUpdatedNotesList(true);
      notify();
    }
  };

  const deleteNote = async (noteId: string) => {
    const response = await axios.delete(
      process.env.REACT_APP_URL + `note/${noteId}`
    );
    if ((response.status = 200)) {
      setHasUpdatedNotesList(true);
      notify();
    }
  };

  const btnEditOnClick = (id: string, content: string) => {
    setNote(content);
    setNoteIdToEdit(id);
    setIsEdit(true);
  };

  const onClickFilter = async () => {
    let query = "";

    if (statusFilter && statusFilter !== "none") {
      query += `?status=${statusFilter}`;
    }

    if (contentFilter) {
      query +=
        query[0] === "?"
          ? `&content=${contentFilter}`
          : `?content=${contentFilter}`;
    }

    const { data }: AxiosResponse<Note[]> = await axios.get(
      process.env.REACT_APP_URL + `user/${userLogged}/notes${query}`
    );

    setNotesList(data);
    setContentFilter("");
    setStatusFilter("none");
  };

  const notify = () => {
    toast.success("Opera????o realizada com sucesso!", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const logout = () => {
    localStorage.removeItem("userLogged");
    navigate("/");
  };

  return (
    <Box
      sx={{ width: "50%", margin: "0 auto" }}
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Box display="flex" justifyContent="space-around">
        <Typography variant="h3" textAlign="left">
          Sistema de Recados
        </Typography>
        <Button
          variant="contained"
          sx={{ width: "100px", padding: "10px 0" }}
          onClick={() => logout()}
        >
          Sair
        </Button>
      </Box>
      <Box display="flex" gap={2}>
        <TextField
          fullWidth
          label="Recado"
          value={note}
          // error={!!noteError}
          // helperText={noteError}
          onChange={(e) => setNote(e.target.value)}
          // onKeyDown={() => setNoteError("")}
        />

        <Button
          variant="contained"
          sx={{ width: "100px", padding: "10px 0" }}
          onClick={handleSubmit}
          disabled={!note}
        >
          Gravar
        </Button>
      </Box>
      <Box>
        <TextField
          fullWidth
          label="Filtro por conte??do"
          value={contentFilter}
          // error={!!noteError}
          // helperText={noteError}
          onChange={(e) => setContentFilter(e.target.value)}
          // onKeyDown={() => setNoteError("")}
        />
        <Box marginTop="10px">
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">
              Filtro por status
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={statusFilter}
              onChange={handleChange}
            >
              <FormControlLabel
                value="false"
                control={<Radio />}
                label="Arquivado"
              />
              <FormControlLabel
                value="true"
                control={<Radio />}
                label="N??o arquivado"
              />
              <FormControlLabel
                value="none"
                control={<Radio />}
                label="Nenhum"
              />
            </RadioGroup>
            <Button
              variant="contained"
              onClick={() => onClickFilter()}
              sx={{ width: "50%" }}
            >
              Filtrar
            </Button>
          </FormControl>
        </Box>
      </Box>
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#c3c3c3" }}>
                <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>
                  #
                </TableCell>
                <TableCell
                  sx={{ fontSize: "16px", fontWeight: "bold" }}
                  align="center"
                >
                  Recados
                </TableCell>
                <TableCell
                  sx={{ fontSize: "16px", fontWeight: "bold" }}
                  align="center"
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{ fontSize: "16px", fontWeight: "bold" }}
                  align="center"
                >
                  A????es
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notesList?.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell align="center">{row.content}</TableCell>
                  <TableCell align="center">
                    {row.status ? "N??o arquivado" : "Arquivado"}
                  </TableCell>
                  <TableCell align="center">
                    {
                      <Box
                        display="flex"
                        gap={2}
                        alignContent="center"
                        justifyContent="center"
                      >
                        <Button
                          variant="contained"
                          sx={{ width: "130px" }}
                          onClick={() => changeStatus(row.status, row.id)}
                        >
                          {row.status ? "Arquivar" : "Desarquivar"}
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ width: "100px" }}
                          onClick={() => btnEditOnClick(row.id, row.content)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ width: "100px" }}
                          color="error"
                          onClick={() => deleteNote(row.id)}
                        >
                          Excluir
                        </Button>
                      </Box>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
