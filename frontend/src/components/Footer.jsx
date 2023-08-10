import React from "react";
import { BsInstagram, BsFacebook, BsLinkedin } from "react-icons/bs";
import {
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";

const autoContraste = "white";

const Icons = {
  BsInstagram: <BsInstagram color={autoContraste} size={24} />,
  BsFacebook: <BsFacebook color={autoContraste} size={24} />,
  BsLinkedin: <BsLinkedin color={autoContraste} size={24} />,
};

const selectRedeSociais = (state) => state?.redeSocial;

function Footer() {
  const primaryColor = useTheme()?.palette?.primaryColor;
  const redesSociais = useSelector(selectRedeSociais);

  return (
    <Paper
      sx={{
        p: 1,
        pt: 2,
        background: primaryColor,
        minHeight: "100px",
        borderRadius: 0,
      }}
    >
      <Stack gap={2}>
        <Typography
          variant="h5"
          sx={{ color: autoContraste, fontFamily: "Caveat" }}
        >
          Siga-nos nas Redes
        </Typography>
        <Stack direction="row" justifyContent="space-evenly">
          {redesSociais?.map((ele) => (
            <Link
              key={ele.icone}
              href={ele.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Stack alignItems="center" gap={1}>
                {Icons[ele.icone]}
                <Typography color={autoContraste} variant="body2">
                  {ele.nome}
                </Typography>
              </Stack>
            </Link>
          ))}
        </Stack>
        <Divider sx={{ background: autoContraste }} />
        <Stack direction="row-reverse" gap={2} alignItems="end">
          <Typography
            variant="h6"
            sx={{ color: autoContraste, fontFamily: "Caveat" }}
          >
            Belo Horizonte e Região - {new Date().getFullYear()}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default Footer;
