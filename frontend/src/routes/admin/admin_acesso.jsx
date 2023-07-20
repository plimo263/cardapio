import React, { useCallback, useRef, useState } from "react";
import { Icon } from "../../components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RECAPTCHA as API_KEY } from "../../env";
import ReCAPTCHA from "react-google-recaptcha";
import _ from "lodash";
import axios from "axios";
import { toast } from "react-toastify";
import * as yup from "yup";
import {
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Slide,
  Stack,
  TextField,
} from "@mui/material";
import { useToggle } from "react-use";
import ManutencaoItens from "./manutencao_itens";

const adminAcessoStr = {
  labelButton: "ENVIAR",
  labelEmail: "E-mail",
  placeholderEmail: "Digite seu email",
  labelPassword: "Sua senha",
  placeholderPassword: "Digite sua senha",
  errorPassword: "* Informe a sua senha",
  errorEmail: "* Informe o seu email",
  errorUnknown: "Erro desconhecido da API, tente novamente mais tarde.",
};

const schema = yup.object().shape({
  email: yup.string().email().required(),
  senha: yup.string().min(1).required(),
});

function AdminAcesso() {
  // Para referenciar o captcha invisivel
  const recaptchaRef = useRef();
  const [viewPasswd, setViewPasswd] = useToggle();
  const [wait, setWait] = useToggle();
  // Estado que controla a atividade do token
  const [token, setToken] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(
    async (val) => {
      // Pega o token do recaptcha
      let TOKEN = recaptchaRef.current.getValue();
      if (!token) {
        TOKEN = await recaptchaRef.current.executeAsync();
        setToken(TOKEN);
      } else {
        await recaptchaRef.current.reset();
        TOKEN = await recaptchaRef.current.executeAsync();
      }
      const obj = {
        ...val,
        captcha: TOKEN,
      };

      try {
        setWait();
        await axios.post("/acesso_admin", obj);
        // Mudar de pagina
        window.location.href = ManutencaoItens.rota;
      } catch (error) {
        let errorMessage;
        // Veja se foi erro com o valor de envio de algum campo
        if (error.response?.data?.errors?.json) {
          const jsonErrors = error.response?.data?.errors?.json;
          _.forEach(_.keys(jsonErrors), (k) => {
            errorMessage = jsonErrors[k][0];
          });
        } else if (error.response?.data?.message) {
          // Veja a mensagem de erro retornada pela api
          errorMessage = error.response?.data?.message;
        } else {
          // Erro desconhecido nao sabemos como lidar com ele ainda.
          errorMessage = `${adminAcessoStr.errorUnknown}`;
        }
        toast.dark(errorMessage, {
          type: "error",
        });
      } finally {
        setWait();
      }
    },
    [token, setWait]
  );

  const errorEmail = Boolean(errors?.email);
  const errorPassword = Boolean(errors?.senha);
  //
  return (
    <Stack
      sx={{
        // background: "linear-gradient(to top, #23074d, #cc5333)",
        height: "calc(100vh - 64px)",
      }}
      justifyContent="center"
      alignItems="center"
    >
      <Slide in unmountOnExit>
        <Paper sx={{ py: 8, px: 2 }} elevation={3}>
          <Container>
            <Stack spacing={1}>
              <Controller
                control={control}
                name="email"
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={adminAcessoStr.labelEmail}
                    type="email"
                    required
                    fullWidth
                    disabled={wait}
                    placeholder={adminAcessoStr.placeholderEmail}
                    error={errorEmail}
                    helperText={errorEmail && adminAcessoStr.errorEmail}
                    InputProps={{
                      startAdornment: <Icon color="primary" icon="Email" />,
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                defaultValue=""
                name="senha"
                render={({ field }) => (
                  <TextField
                    type={viewPasswd ? "text" : "password"}
                    fullWidth
                    {...field}
                    disabled={wait}
                    label={adminAcessoStr.labelPassword}
                    placeholder={adminAcessoStr.placeholderPassword}
                    helperText={errorPassword && adminAcessoStr.errorPassword}
                    error={errorPassword}
                    InputProps={{
                      startAdornment: <Icon color="primary" icon="Email" />,
                      endAdornment: (
                        <IconButton onClick={setViewPasswd}>
                          <Icon
                            icon={viewPasswd ? "Visibility" : "VisibilityOff"}
                          />
                        </IconButton>
                      ),
                    }}
                  />
                )}
              />
              <Button
                disabled={wait}
                startIcon={wait ? <CircularProgress size={20} /> : null}
                onClick={handleSubmit(onSubmit)}
                variant="contained"
              >
                {adminAcessoStr.labelButton}
              </Button>
            </Stack>
          </Container>
        </Paper>
      </Slide>
      <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={API_KEY} />
    </Stack>
  );
}

AdminAcesso.rota = "/acesso_login";

export default AdminAcesso;
