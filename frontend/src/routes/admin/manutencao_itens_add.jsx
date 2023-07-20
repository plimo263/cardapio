import {
  Button,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Icon } from "../../components";
import { useDispatch } from "react-redux";
import { itemAdd } from "../../redux/actions/items-actions";
import { useToggle } from "react-use";

const validator = yup.object().shape({
  nome: yup.string().min(3).required(),
  descricao: yup.string().min(3).required(),
});

const manutencaoItensAddStr = {
  titleForm: "Categoria ",
  descriptionForm: "Você esta criando um novo item para esta categoria",
  labelName: "Nome do item",
  placeholderName: "Nome do item a ser criado",
  labelDescription: "Descrição do item",
  placeholderDescription: "Descrição do item a ser criado",
  labelButtonAdd: "ADICIONAR",
  errorName: "* Necessita de no mínimo 3 caracteres.",
  errorDescription: "* Necessita de no mínimo 3 caracteres.",
};

function ManutencaoItensAdd({ category, closeModal }) {
  return (
    <Stack>
      <Typography align="center" variant="h6">
        {manutencaoItensAddStr.titleForm} {category}
      </Typography>
      <Typography variant="body1" align="center">
        {manutencaoItensAddStr.descriptionForm}
      </Typography>
      <Form category={category} closeModal={closeModal} />
    </Stack>
  );
}

const Form = ({ category, closeModal }) => {
  const dispatch = useDispatch();
  const [wait, setWait] = useToggle();
  //
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(validator),
  });
  //
  const onSubmit = useCallback(
    (val) => {
      const obj = {
        ...val,
        categoria: category,
      };
      //
      dispatch(itemAdd(obj, setWait, closeModal));
    },
    [category, closeModal, setWait, dispatch]
  );

  console.log(errors);
  return (
    <Container maxWidth="sm">
      <Stack spacing={1}>
        <Controller
          name="nome"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <TextField
              type="text"
              label={manutencaoItensAddStr.labelName}
              placeholder={manutencaoItensAddStr.placeholderName}
              required
              disabled={wait}
              {...field}
              error={Boolean(errors?.nome)}
              helperText={
                errors?.nome && (
                  <Typography variant="caption">
                    {manutencaoItensAddStr.errorName}
                  </Typography>
                )
              }
            />
          )}
        />
        <Controller
          name="descricao"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <TextField
              type="textarea"
              minRows={3}
              multiline
              label={manutencaoItensAddStr.labelDescription}
              placeholder={manutencaoItensAddStr.placeholderDescription}
              required
              disabled={wait}
              {...field}
              error={Boolean(errors?.descricao)}
              helperText={
                errors?.descricao && (
                  <Typography variant="caption">
                    {manutencaoItensAddStr.errorDescription}
                  </Typography>
                )
              }
            />
          )}
        />
        <Button
          onClick={handleSubmit(onSubmit)}
          startIcon={
            wait ? <CircularProgress size={20} /> : <Icon icon="Add" />
          }
          variant="contained"
          disabled={wait}
          fullWidth
        >
          {manutencaoItensAddStr.labelButtonAdd}
        </Button>
      </Stack>
    </Container>
  );
};

export default ManutencaoItensAdd;
