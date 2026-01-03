import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Button,
  Fab,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  DeleteOutline,
  OpenInNew,
  UploadFile,
  ContentCopy,
  Visibility,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { imageService } from "../services/imageService";

const ArquivosFront = () => {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadStatuses, setUploadStatuses] = useState([]);
  const [preview, setPreview] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const fileRef = useRef();

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await imageService.list();
      setImages(data || []);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Erro ao carregar imagens",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleUploadClick = () => fileRef.current.click();
  const handleFileChange = async (e) => {
    const files = e.target.files && Array.from(e.target.files);
    if (!files || files.length === 0) return;
    // initialize statuses
    const initial = files.map((f) => ({
      name: f.name,
      status: "pending",
      progress: 0,
    }));
    setUploadStatuses(initial);
    setUploadModalOpen(true);
    setUploading(true);
    try {
      const promises = files.map((f, idx) =>
        imageService.upload(f, (evt) => {
          const percent = evt.total
            ? Math.round((evt.loaded * 100) / evt.total)
            : 0;
          setUploadStatuses((prev) => {
            const copy = prev.slice();
            copy[idx] = {
              ...copy[idx],
              progress: percent,
              status: "uploading",
            };
            return copy;
          });
        })
      );

      const results = await Promise.allSettled(promises);
      // update statuses final state
      setUploadStatuses((prev) =>
        prev.map((s, i) => {
          const res = results[i];
          if (res && res.status === "fulfilled") {
            return { ...s, status: "done", progress: 100 };
          }
          return { ...s, status: "failed" };
        })
      );

      const rejected = results.filter((r) => r.status === "rejected");
      if (rejected.length > 0) {
        setSnackbar({
          open: true,
          message: `${rejected.length} arquivo(s) falharam no upload`,
          severity: "warning",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Upload concluído",
          severity: "success",
        });
      }

      fetch();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || err.message || "Erro no upload";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setUploading(false);
      // keep modal open so user can inspect results; reset file input
      e.target.value = null;
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta imagem?")) return;
    try {
      await imageService.remove(id);
      setSnackbar({
        open: true,
        message: "Imagem excluída",
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

  const handleCopy = (img) => {
    let src = img.filename
      ? `${window.location.origin}${img.filename}`
      : img.urls?.original || img.urls?.mobile || img.urls?.thumb;
    if (!src) src = "";
    // If full URL contains /uploads, copy only from /uploads/... onwards
    const uploadsIdx = src.indexOf("/uploads/");
    const toCopy = uploadsIdx !== -1 ? src.substring(uploadsIdx) : src;
    navigator.clipboard?.writeText(toCopy);
    setSnackbar({ open: true, message: "URL copiada", severity: "success" });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} disableGutters>
      <Paper sx={{ p: 2 }} elevation={0}>
        <Typography variant="h5">Bucket</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flex: 1,
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {/* Desktop/tablet: regular button; hidden on xs */}
            <Button
              variant="contained"
              startIcon={<UploadFile />}
              onClick={handleUploadClick}
              disabled={uploading}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              {uploading ? "Enviando..." : "Fazer upload"}
            </Button>

            {/* Mobile: FAB floating, hidden on sm+ */}
            <Fab
              color="primary"
              aria-label="upload"
              onClick={handleUploadClick}
              sx={{
                display: { xs: "inline-flex", sm: "none" },
                position: "fixed",
                bottom: 16,
                right: 16,
                zIndex: 1300,
              }}
            >
              <UploadFile />
            </Fab>

            <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
              <TextField
                id="search"
                size="small"
                placeholder="Pesquisar por nome"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearch("");
                }}
                fullWidth
                sx={{ width: { xs: "100%", sm: "100%" } }}
                InputProps={{ sx: { width: "100%" } }}
              />
            </Box>
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
              gap: 3,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
            }}
          >
            {images
              .filter((img) => {
                const name = (
                  img.original_name ||
                  img.filename ||
                  ""
                ).toLowerCase();
                return name.includes((search || "").toLowerCase());
              })
              .map((img) => (
                <Box key={img.id} sx={{ width: "100%" }}>
                  <Card
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ height: 160, objectFit: "cover", width: "100%" }}
                      image={
                        img.filename ||
                        img.urls?.thumb ||
                        img.urls?.mobile ||
                        img.urls?.original
                      }
                      alt={img.original_name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography noWrap variant="subtitle2">
                        {img.original_name || img.filename}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {img.created_at
                          ? new Date(img.created_at).toLocaleString()
                          : ""}
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{ justifyContent: "space-around", gap: 1, px: 1 }}
                    >
                      <Tooltip title="Visualizar (original)">
                        <IconButton
                          size="small"
                          onClick={() =>
                            setPreview(`/images/${img.id}?size=original`)
                          }
                          sx={{ color: "#1976d2" }}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Abrir em nova aba (original)">
                        <IconButton
                          size="small"
                          href={`/images/${img.id}?size=original`}
                          target="_blank"
                          rel="noreferrer"
                          sx={{ color: "#00796b" }}
                        >
                          <OpenInNew />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Copiar URL">
                        <IconButton
                          size="small"
                          onClick={() => handleCopy(img)}
                          sx={{ color: "#ef6c00" }}
                        >
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(img.id)}
                          sx={{ color: "#c62828" }}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Box>
              ))}
          </Box>
        )}

        <Dialog
          open={!!preview}
          onClose={() => setPreview(null)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>Preview</DialogTitle>
          <DialogContent>
            {preview && (
              <img src={preview} alt="preview" style={{ width: "100%" }} />
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                navigator.clipboard?.writeText(preview);
                setSnackbar({
                  open: true,
                  message: "URL copiada",
                  severity: "success",
                });
              }}
            >
              Copiar URL
            </Button>
            <Button onClick={() => setPreview(null)}>Fechar</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={uploadModalOpen}
          onClose={() => {
            if (!uploading) setUploadModalOpen(false);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Enviando arquivos</DialogTitle>
          <DialogContent>
            <List>
              {uploadStatuses.map((s, i) => (
                <ListItem key={i} divider>
                  <ListItemText
                    primary={s.name}
                    secondary={
                      s.status === "uploading" ? `${s.progress}%` : s.status
                    }
                  />
                  <Box sx={{ width: 200, ml: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={s.progress || 0}
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setUploadModalOpen(false)}
              disabled={uploading}
            >
              Fechar
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
    </Container>
  );
};

export default ArquivosFront;
