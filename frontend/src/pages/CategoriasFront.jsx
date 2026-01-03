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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { CheckCircle, Cancel } from "@mui/icons-material";
import Tabela from "../components/Tabela";
import { categoriaService } from "../services/categoriaService";

const CategoriasFront = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nome: "", ativo: true });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [search, setSearch] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);

  const handleOpenMenu = (e, row) => {
    setMenuAnchorEl(e.currentTarget);
    setMenuRow(row);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setMenuRow(null);
  };

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await categoriaService.list();
      setRows(data);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Erro ao carregar categorias",
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
    setForm({ nome: "", ativo: true });
    setOpenDialog(true);
  };

  const handleOpenEdit = (row) => {
    setEditing(row);
    setForm({ nome: row.nome || "", ativo: row.ativo !== false });
    setOpenDialog(true);
  };

  const handleClose = () => setOpenDialog(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await categoriaService.update(editing.id, {
          nome: form.nome,
          ativo: form.ativo,
        });
        setSnackbar({
          open: true,
          message: "Categoria atualizada",
          severity: "success",
        });
      } else {
        await categoriaService.create({ nome: form.nome });
        setSnackbar({
          open: true,
          message: "Categoria criada",
          severity: "success",
        });
      }
      setOpenDialog(false);
      fetch();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Erro ao salvar",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;
    try {
      await categoriaService.remove(id);
      setSnackbar({
        open: true,
        message: "Categoria excluída",
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

  const columns = [
    { field: "id", label: "ID" },
    { field: "nome", label: "Nome" },
    {
      field: "ativo",
      label: "Ativo",
      render: (r) =>
        r.ativo ? (
          <CheckCircle sx={{ color: "#2e7d32" }} titleAccess="Ativo" />
        ) : (
          <Cancel sx={{ color: "#c62828" }} titleAccess="Inativo" />
        ),
    },
  ];

  const rowsArray = Array.isArray(rows) ? rows : [];
  const q = (search || "").trim().toLowerCase();
  const filtered = rowsArray.filter((r) => {
    if (!q) return true;
    return (r.nome || "").toLowerCase().includes(q);
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} disableGutters>
      <Paper sx={{ p: 2 }} elevation={0}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Typography variant="h6">Categorias</Typography>
            <Box sx={{ mt: 1, display: { xs: "block", md: "none" } }}>
              <TextField
                id="search"
                size="small"
                placeholder="Pesquisar por nome"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{ display: { xs: "none", md: "inline-flex" } }}
          >
            Criar categoria
          </Button>
        </Box>

        {/* Search on desktop placed next to title area */}
        <Box sx={{ display: { xs: "none", md: "block" }, mb: 2 }}>
          <TextField
            id="search"
            size="small"
            placeholder="Pesquisar por nome"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : isMobile ? (
          <Paper sx={{ p: 1 }} elevation={0}>
            <List>
              {filtered.length === 0 ? (
                <Typography sx={{ p: 2 }}>Nenhuma categoria</Typography>
              ) : (
                filtered.map((r) => (
                  <ListItem key={r.id} divider>
                    <ListItemIcon>
                      {r.ativo ? (
                        <CheckCircle sx={{ color: "#2e7d32" }} />
                      ) : (
                        <Cancel sx={{ color: "#c62828" }} />
                      )}
                    </ListItemIcon>
                    <ListItemText primary={r.nome} />
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <IconButton
                        edge="end"
                        onClick={(e) => handleOpenMenu(e, r)}
                      >
                        <svg viewBox="0 0 24 24" width="24" height="24">
                          <circle cx="5" cy="12" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="19" cy="12" r="2" />
                        </svg>
                      </IconButton>
                    </Box>
                  </ListItem>
                ))
              )}
            </List>

            <Menu
              id="category-menu"
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem
                onClick={() => {
                  if (menuRow) handleOpenEdit(menuRow);
                  handleCloseMenu();
                }}
              >
                Editar
              </MenuItem>
              <MenuItem
                onClick={() => {
                  if (menuRow) handleDelete(menuRow.id);
                  handleCloseMenu();
                }}
              >
                Excluir
              </MenuItem>
            </Menu>
          </Paper>
        ) : (
          <Tabela
            columns={columns}
            rows={rows}
            loading={loading}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        )}

        <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {editing ? "Editar categoria" : "Criar categoria"}
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
      {/* Mobile FAB for creating category */}
      <Fab
        color="primary"
        aria-label="criar-categoria"
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

export default CategoriasFront;
