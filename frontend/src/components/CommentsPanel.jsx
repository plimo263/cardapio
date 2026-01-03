import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Rating,
  IconButton,
  SwipeableDrawer,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { commentService } from "../services/commentService";
import { bebidaService } from "../services/bebidaService";
import { useTheme } from "@mui/material/styles";

const COMMENTS_KEY = "cardapio:comments";

const CommentsPanel = ({
  bebidaId,
  open,
  onClose,
  onCommentPosted,
  viewOnly = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(8);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const observerRef = useRef();
  const lastItemRef = useRef();

  const [texto, setTexto] = useState("");
  const [nota, setNota] = useState(5);
  const [autor, setAutor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasCommented, setHasCommented] = useState(false);
  const [askLocation, setAskLocation] = useState(false);
  const [locating, setLocating] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const load = async (p = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      const res = await commentService.list(bebidaId, p, perPage);
      const newItems = res.items || [];
      if (append) {
        setItems((prev) => [...prev, ...newItems]);
        if (newItems.length === 0) {
          setHasMore(false);
          setSnackbar({ open: true, message: "Não há mais comentários" });
        }
      } else {
        setItems(newItems);
        setHasMore(newItems.length >= perPage);
      }
      setTotal(res.total || 0);
      setPage(p);
    } catch (e) {
      console.error("Failed to load comments", e);
      if (!append) {
        setItems([]);
        setTotal(0);
      }
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setItems([]);
      setPage(1);
      setHasMore(true);
      load(1, false);
    }
  }, [open, bebidaId]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      load(page + 1, true);
    }
  }, [loadingMore, hasMore, loading, page, bebidaId]);

  useEffect(() => {
    if (!lastItemRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );
    observer.observe(lastItemRef.current);
    observerRef.current = observer;
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadMore, items, hasMore]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(COMMENTS_KEY);
      if (raw) {
        const map = JSON.parse(raw) || {};
        setHasCommented(!!map[String(bebidaId)]);
      } else {
        setHasCommented(false);
      }
    } catch (e) {
      setHasCommented(false);
    }
  }, [open, bebidaId]);

  const doSubmit = async (latitude = null, longitude = null) => {
    if (!texto || nota < 1 || nota > 5) return;
    setSubmitting(true);
    try {
      const payload = { texto, nota, autor: autor || null };
      if (latitude != null && longitude != null) {
        payload.latitude = latitude;
        payload.longitude = longitude;
      }
      await commentService.create(bebidaId, payload);

      // clear form
      setTexto("");
      setNota(5);
      setAutor("");

      // mark locally to prevent duplicate comments
      try {
        const raw = localStorage.getItem(COMMENTS_KEY);
        const map = raw ? JSON.parse(raw) : {};
        map[String(bebidaId)] = true;
        localStorage.setItem(COMMENTS_KEY, JSON.stringify(map));
        setHasCommented(true);
      } catch (e) {
        // ignore
      }

      // reload comments and notify parent to refresh aggregates
      await load(1);
      if (onCommentPosted) {
        try {
          const bebida = await bebidaService.get(bebidaId);
          onCommentPosted(bebida);
        } catch (e) {
          console.warn("Failed to refresh bebida after comment", e);
        }
      }
    } catch (e) {
      console.error("Failed to post comment", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = () => {
    if (!texto || nota < 1 || nota > 5) return;
    // ask about sharing location
    setAskLocation(true);
  };

  const confirmLocation = (agree) => {
    setAskLocation(false);
    if (!agree) {
      doSubmit(null, null);
      return;
    }

    if (!navigator.geolocation) {
      doSubmit(null, null);
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude } = pos.coords;
        doSubmit(latitude, longitude);
      },
      (err) => {
        console.warn("Geolocation failed or permission denied", err);
        setLocating(false);
        doSubmit(null, null);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  const handleChangePage = (e, value) => {
    load(value);
  };

  const content = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Fixed Header */}
      <Box sx={{ p: 2, position: "relative", flexShrink: 0 }}>
        <IconButton
          sx={{ position: "absolute", right: 8, top: 8 }}
          onClick={onClose}
          size="large"
        >
          <CloseIcon />
        </IconButton>

        {/* handle bar for bottom sheet */}
        {isMobile && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <Box
              sx={{ width: 40, height: 4, bgcolor: "divider", borderRadius: 2 }}
            />
          </Box>
        )}

        <Typography variant="h6" sx={{ mb: 1 }}>
          Comentários
        </Typography>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2, pb: 2 }}>
        <Box sx={{ mb: 2 }}>
          {!viewOnly &&
            (hasCommented ? (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Você já comentou este produto.
              </Typography>
            ) : (
              <>
                <TextField
                  label="Seu nome (opcional)"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ mb: 1 }}
                />

                <TextField
                  label="Comentário"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  fullWidth
                  multiline
                  minRows={3}
                  sx={{ mb: 1 }}
                />

                <Box
                  sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}
                >
                  <Typography variant="body2">Nota</Typography>
                  <Rating
                    value={nota}
                    onChange={(e, v) => setNota(v || 5)}
                    max={5}
                  />
                </Box>

                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting || !texto}
                  fullWidth
                >
                  {submitting ? <CircularProgress size={18} /> : "Enviar"}
                </Button>
              </>
            ))}
        </Box>

        <Divider sx={{ mb: 1 }} />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <List>
              {items.map((c, idx) => (
                <React.Fragment key={c.id}>
                  <ListItem
                    alignItems="flex-start"
                    ref={idx === items.length - 1 ? lastItemRef : null}
                  >
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: "flex", gap: 1, alignItems: "center" }}
                        >
                          <Rating
                            value={Number(c.nota)}
                            size="small"
                            readOnly
                          />
                          <Typography variant="subtitle2">
                            {c.autor || "Anônimo"}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {c.texto}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {c.created_at
                              ? new Date(c.created_at).toLocaleString()
                              : ""}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>

            {loadingMore && (
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </>
        )}

        <Dialog open={askLocation} onClose={() => confirmLocation(false)}>
          <Box sx={{ p: 2, minWidth: 300 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Deseja indicar em qual loja você está pela sua localização?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Isso ajuda a melhorar os serviços do cardápio das lojas.
            </Typography>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button
                onClick={() => confirmLocation(false)}
                disabled={locating}
              >
                Não
              </Button>
              <Button
                variant="contained"
                onClick={() => confirmLocation(true)}
                disabled={locating}
              >
                {locating ? <CircularProgress size={18} /> : "Sim"}
              </Button>
            </Box>
          </Box>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={() => setSnackbar({ open: false, message: "" })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="info" sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="bottom"
        open={!!open}
        onClose={onClose}
        onOpen={() => {}}
        disableBackdropTransition={false}
      >
        <Box sx={{ height: "70vh", display: "flex", flexDirection: "column" }}>
          {content}
        </Box>
      </SwipeableDrawer>
    );
  }

  return (
    <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="sm">
      {content}
    </Dialog>
  );
};

export default CommentsPanel;
