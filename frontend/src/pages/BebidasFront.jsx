import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Rating,
} from "@mui/material";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  Visibility,
  OpenInNew,
  ContentCopy,
  DeleteOutline,
  Edit,
} from "@mui/icons-material";
import { bebidaService } from "../services/bebidaService";
import { categoriaService } from "../services/categoriaService";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { motion } from "framer-motion";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import StarIcon from "@mui/icons-material/Star";
import CommentsPanel from "../components/CommentsPanel";
import MenuDetail from "../components/MenuDetail";

const BebidasFront = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "0.00",
    imagem_url: "",
    ativo: true,
    categoria_id: "",
  });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await bebidaService.list();
      setRows(data || []);
      const cats = await categoriaService.list();
      setCategories(cats || []);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Erro ao carregar bebidas",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleOpenCreate = () => {
    setEditing(null);
    setForm({
      nome: "",
      descricao: "",
      preco: "0.00",
      imagem_url: "",
      ativo: true,
      categoria_id: categories[0]?.id || "",
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (row) => {
    setEditing(row);
    setForm({
      nome: row.nome || "",
      descricao: row.descricao || "",
      preco: row.preco || "0.00",
      imagem_url: row.imagem_url || "",
      ativo: row.ativo !== false,
      categoria_id: row.categoria_id,
    });
    setOpenDialog(true);
  };

  const handleClose = () => setOpenDialog(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
      };
      if (editing) {
        await bebidaService.update(editing.id, payload);
        setSnackbar({
          open: true,
          message: "Bebida atualizada",
          severity: "success",
        });
      } else {
        await bebidaService.create(payload);
        setSnackbar({
          open: true,
          message: "Bebida criada",
          severity: "success",
        });
      }
      setOpenDialog(false);
      fetch();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err.message ||
        "Erro ao salvar";
      setSnackbar({
        open: true,
        message: typeof msg === "string" ? msg : JSON.stringify(msg),
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta bebida?")) return;
    try {
      await bebidaService.remove(id);
      setSnackbar({
        open: true,
        message: "Bebida excluída",
        severity: "success",
      });
      fetch();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Erro ao excluir",
        severity: "error",
      });
    }
  };

  const handleLike = async (id) => {
    // Curtir foi desabilitado na interface (somente leitura).
    return;
  };

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [selectedBebida, setSelectedBebida] = useState(null);
  const [heroOpen, setHeroOpen] = useState(false);
  const [heroItem, setHeroItem] = useState(null);

  const openComments = (row) => {
    setSelectedBebida(row);
    setCommentsOpen(true);
  };

  const openHero = (row) => {
    setHeroItem(row);
    setHeroOpen(true);
  };

  const rowsArray = Array.isArray(rows) ? rows : [];
  if (!Array.isArray(rows))
    console.warn("BebidasFront: rows is not an array", rows);
  const filtered = rowsArray.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const catName = r.categoria?.nome || "";
    return (
      (r.nome || "").toLowerCase().includes(q) ||
      catName.toLowerCase().includes(q)
    );
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} disableGutters>
      <Paper sx={{ p: 2 }} elevation={0}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            mb: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Typography
            variant="h6"
            sx={{ width: { xs: "100%", md: "auto" }, mb: { xs: 1, md: 0 } }}
          >
            Bebidas
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexDirection: { xs: "column", md: "row" },
              width: { xs: "100%", md: "auto" },
            }}
          >
            <TextField
              size="small"
              placeholder="Pesquisar por nome ou categoria"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              sx={{ mr: { md: 2 }, mb: { xs: 1, md: 0 } }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{
                display: { xs: "none", md: "inline-flex" },
                width: { xs: "100%", md: "auto" },
              }}
              size="medium"
            >
              Criar
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 1,
              gridTemplateColumns: {
                xs: "repeat(1,1fr)",
                sm: "repeat(2,1fr)",
                md: "repeat(3,1fr)",
              },
            }}
          >
            {filtered.map((row) => (
              <Box key={row.id} sx={{ width: "100%" }}>
                <Card
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {(() => {
                    const id = String(row.id || row.nome);
                    const img = row.imagem_url || row.categoria?.imagem || "";
                    return (
                      <motion.div
                        layoutId={`image-${id}`}
                        style={{
                          overflow: "hidden",
                          borderRadius: 6,
                          width: "100%",
                        }}
                      >
                        <CardMedia
                          component="img"
                          sx={{
                            height: 160,
                            objectFit: "cover",
                            width: "100%",
                            cursor: "pointer",
                          }}
                          image={img}
                          alt={row.nome}
                          onClick={() => openHero(row)}
                        />
                      </motion.div>
                    );
                  })()}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography noWrap variant="subtitle1">
                      {row.nome}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.categoria?.nome || ""}
                    </Typography>
                    <Typography variant="body2">{row.descricao}</Typography>
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                      R$ {row.preco}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{ justifyContent: "flex-start", gap: 1, px: 1 }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => setOpenDialog(true) || handleOpenEdit(row)}
                      sx={{ color: "#1976d2" }}
                      title="Editar"
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => {
                        navigator.clipboard?.writeText(row.imagem_url || "");
                        setSnackbar({
                          open: true,
                          message: "URL copiada",
                          severity: "success",
                        });
                      }}
                      sx={{ color: "#ef6c00" }}
                      title="Copiar URL"
                    >
                      <ContentCopy />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(row.id)}
                      sx={{ color: "#c62828" }}
                      title="Excluir"
                    >
                      <DeleteOutline />
                    </IconButton>

                    {/* Curtidas: somente leitura (não envia like) */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#b71c1c",
                      }}
                      title="Quantidade de curtidas"
                    >
                      <FavoriteIcon fontSize="small" />

                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        {row.likes || 0}
                      </Typography>
                    </Box>

                    {/* Média de avaliações: ícone de estrela + número (0 se nulo) */}
                    <Box
                      sx={{ display: "flex", alignItems: "center", ml: 1 }}
                      title="Avaliação média"
                    >
                      <StarIcon sx={{ fontSize: 20, color: "#fbc02d" }} />
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        {row.avg_rating != null ? row.avg_rating : 0}
                      </Typography>
                    </Box>

                    {/* Botão de comentários (abre modal) */}
                    <IconButton
                      size="small"
                      onClick={() => openComments(row)}
                      sx={{ color: "#1565c0" }}
                      title="Ver comentários"
                    >
                      <ChatBubbleOutlineIcon fontSize="small" />
                      &nbsp;
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        {row.comments_count || 0}
                      </Typography>
                    </IconButton>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}

        <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {editing ? "Editar bebida" : "Criar bebida"}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Nome"
              name="nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              sx={{ mt: 1 }}
            />
            <TextField
              fullWidth
              label="Descrição"
              multiline
              rows={3}
              name="descricao"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Preço"
              name="preco"
              value={form.preco}
              onChange={(e) => setForm({ ...form, preco: e.target.value })}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Imagem URL"
              name="imagem_url"
              value={form.imagem_url}
              onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="categoria-label">Categoria</InputLabel>
              <Select
                labelId="categoria-label"
                value={form.categoria_id}
                label="Categoria"
                onChange={(e) =>
                  setForm({ ...form, categoria_id: e.target.value })
                }
              >
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={form.ativo}
                  onChange={(e) =>
                    setForm({ ...form, ativo: e.target.checked })
                  }
                />
              }
              label="Ativo"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} variant="contained" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogActions>
        </Dialog>

        <CommentsPanel
          bebidaId={selectedBebida ? selectedBebida.id : null}
          open={commentsOpen}
          onClose={() => setCommentsOpen(false)}
          viewOnly={true}
          onCommentPosted={(bebida) => {
            // atualizar aggregates na lista de bebidas
            setRows((prev) =>
              prev.map((r) => (r.id === bebida.id ? bebida : r))
            );
          }}
        />

        <MenuDetail
          item={heroItem}
          open={heroOpen}
          onClose={() => setHeroOpen(false)}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
      {/* Mobile FAB: Criar bebida */}
      <Fab
        color="primary"
        aria-label="criar-bebida"
        onClick={handleOpenCreate}
        sx={{
          display: { xs: "inline-flex", md: "none" },
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1300,
        }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default BebidasFront;
