import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Add,
  CheckCircle,
  Cancel,
  Edit,
  DeleteOutline,
  MoreVert,
  Engineering,
  Person,
} from "@mui/icons-material";
import Tabela from "../components/Tabela";
import { userService } from "../services/userService";

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    is_admin: false,
  });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [search, setSearch] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.list();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Erro ao carregar usuários",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenCreate = () => {
    setEditing(null);
    setForm({ username: "", email: "", password: "", is_admin: false });
    setOpenDialog(true);
  };

  const handleOpenEdit = (u) => {
    setEditing(u);
    setForm({
      username: u.username || "",
      email: u.email || "",
      password: "",
      is_admin: !!u.is_admin,
    });
    setOpenDialog(true);
  };

  const handleClose = () => setOpenDialog(false);

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        const payload = { username: form.username, email: form.email };
        if (form.password) payload.password = form.password;
        if (form.is_admin !== undefined) payload.is_admin = form.is_admin;
        if (form.active !== undefined) payload.active = form.active;
        await userService.update(editing.id, payload);
        setSnackbar({
          open: true,
          message: "Usuário atualizado",
          severity: "success",
        });
      } else {
        const payload = {
          username: form.username,
          email: form.email,
          password: form.password,
          is_admin: form.is_admin,
        };
        await userService.create(payload);
        setSnackbar({
          open: true,
          message: "Usuário criado",
          severity: "success",
        });
      }
      handleClose();
      fetchUsers();
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
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      await userService.remove(id);
      setSnackbar({
        open: true,
        message: "Usuário excluído",
        severity: "success",
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Erro ao excluir",
        severity: "error",
      });
    }
  };

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuUser, setMenuUser] = useState(null);

  const handleOpenMenu = (event, u) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuUser(u);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setMenuUser(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          mb: 2,
          gap: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{ width: { xs: "100%", md: "auto" }, mb: { xs: 1, md: 0 } }}
        >
          Usuários
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
            placeholder="Pesquisar por username ou email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={{ mr: { md: 2 }, mb: { xs: 1, md: 0 } }}
          />

          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={handleOpenCreate}
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            Criar usuário
          </Button>
        </Box>
      </Box>

      {(() => {
        const q = search.trim().toLowerCase();
        const filtered = users.filter((u) => {
          if (!q) return true;
          return (
            (u.username || "").toLowerCase().includes(q) ||
            (u.email || "").toLowerCase().includes(q)
          );
        });

        if (isMobile) {
          return (
            <Paper sx={{ p: 1 }} elevation={0}>
              <List>
                {loading ? (
                  <Typography sx={{ p: 2 }}>Carregando...</Typography>
                ) : filtered.length === 0 ? (
                  <Typography sx={{ p: 2 }}>Nenhum usuário</Typography>
                ) : (
                  filtered.map((u) => (
                    <ListItem key={u.id} divider>
                      <ListItemIcon>
                        {u.is_admin ? <Engineering /> : <Person />}
                      </ListItemIcon>
                      <ListItemText primary={u.username} secondary={u.email} />
                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        {u.active ? (
                          <CheckCircle sx={{ color: "#2e7d32" }} />
                        ) : (
                          <Cancel sx={{ color: "#c62828" }} />
                        )}

                        <IconButton
                          edge="end"
                          aria-controls={menuAnchorEl ? "user-menu" : undefined}
                          aria-haspopup="true"
                          onClick={(e) => handleOpenMenu(e, u)}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))
                )}
              </List>
              <Menu
                id="user-menu"
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem
                  onClick={() => {
                    if (menuUser) handleOpenEdit(menuUser);
                    handleCloseMenu();
                  }}
                >
                  Editar
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    if (menuUser) handleDelete(menuUser.id);
                    handleCloseMenu();
                  }}
                >
                  Excluir
                </MenuItem>
              </Menu>
            </Paper>
          );
        }

        const columns = [
          { field: "id", label: "ID" },
          { field: "username", label: "Username" },
          { field: "email", label: "Email" },
          {
            field: "is_admin",
            label: "Admin",
            render: (u) => (u.is_admin ? "Sim" : "Não"),
          },
          {
            field: "active",
            label: "Ativo",
            render: (u) =>
              u.active ? (
                <CheckCircle sx={{ color: "#2e7d32" }} titleAccess="Ativo" />
              ) : (
                <Cancel sx={{ color: "#c62828" }} titleAccess="Inativo" />
              ),
          },
        ];

        return (
          <Tabela
            columns={columns}
            rows={users}
            loading={loading}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        );
      })()}

      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editing ? "Editar usuário" : "Criar usuário"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Senha"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
            helperText={
              editing ? "Deixe em branco para manter a senha atual" : ""
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.is_admin}
                onChange={(e) =>
                  setForm({ ...form, is_admin: e.target.checked })
                }
              />
            }
            label="Admin"
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
            }
            label="Ativo"
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
    </Container>
  );
};

export default Usuarios;
