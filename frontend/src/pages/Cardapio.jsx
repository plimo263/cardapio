import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  CircularProgress,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Button,
  Tabs,
  Tab,
  Slide,
  Collapse,
  Grow,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Drawer,
  Dialog,
  Snackbar,
  Alert,
  useMediaQuery,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import confetti from "canvas-confetti";
import {
  Brightness4,
  Brightness7,
  Favorite,
  FavoriteBorder,
  ChatBubble,
  ChatBubbleOutline,
  RecordVoiceOver,
  LocalCafe,
} from "@mui/icons-material";
import { bebidaService } from "../services/bebidaService";
import { categoriaService } from "../services/categoriaService";
import CommentsPanel from "../components/CommentsPanel";
import { commentService } from "../services/commentService";
import { useThemeMode } from "../ThemeModeProvider";
import fundoDark from "../assets/fundo_dark.png";
import fundoLight from "../assets/fundo_light.png";

import { useTheme } from "@mui/material/styles";
import { motion, LayoutGroup } from "framer-motion";
import MenuDetail from "../components/MenuDetail";

const Cardapio = () => {
  const [categorias, setCategorias] = useState([]);
  const [bebidas, setBebidas] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [comments, setComments] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const { mode, toggleMode } = useThemeMode();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeItem, setActiveItem] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleOpenImage = (item) => {
    setActiveItem(item);
    setDetailOpen(true);
  };

  const handleCloseImage = () => {
    setDetailOpen(false);
    // keep activeItem until reverse animation completes
    setTimeout(() => setActiveItem(null), 300);
  };

  const idFromB = (b) => b?.id || b?._id || b?.nome;
  // Confetti using canvas-confetti
  const launchConfetti = (count = 30, x = 0.5, y = 0.3) => {
    try {
      const defaults = { origin: { x, y }, ticks: 200 };
      // multiple bursts for a nicer effect
      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.25),
        spread: 26,
        startVelocity: 55,
      });
      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.2),
        spread: 60,
        decay: 0.9,
      });
      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.55),
        spread: 120,
        scalar: 0.8,
      });
    } catch (e) {
      console.warn("Confetti failed", e);
    }
  };
  const toggleFavorite = async (id, b) => {
    const prevFav = !!favorites[id];
    const prevLike = Number(likeCounts[id] || 0);
    const newFav = !prevFav;

    // Optimistic UI update
    setFavorites((p) => ({ ...p, [id]: newFav }));
    setLikeCounts((lc) => ({
      ...lc,
      [id]: (lc[id] || 0) + (newFav ? 1 : -1),
    }));

    console.log("toggleFavorite", { id, newFav, prevLike });

    const targetId = (b && (b.id || b._id)) || idFromB(b) || id;
    if (newFav) {
      try {
        console.log("calling API: bebidaService.like", targetId);
        const res = await bebidaService.like(targetId);
        console.log("like response:", res);
        let likesFromRes = null;
        if (res != null) {
          if (typeof res === "number") likesFromRes = res;
          else if (res.likes != null) likesFromRes = res.likes;
          else if (res.data && res.data.likes != null)
            likesFromRes = res.data.likes;
          else if (res.items && res.items.likes != null)
            likesFromRes = res.items.likes;
        }
        if (likesFromRes != null) {
          setLikeCounts((lc) => ({ ...lc, [id]: Number(likesFromRes) }));
          // play confetti on successful like
          try {
            launchConfetti(120);
          } catch (e) {}
        }
      } catch (err) {
        console.error("Erro ao curtir bebida", err);
        // Rollback on failure
        setFavorites((p) => ({ ...p, [id]: prevFav }));
        setLikeCounts((lc) => ({ ...lc, [id]: prevLike }));
      }
    } else {
      try {
        console.log("calling API: bebidaService.unlike", targetId);
        const res = await bebidaService.unlike(targetId);
        console.log("unlike response:", res);
        let likesFromRes = null;
        if (res != null) {
          if (typeof res === "number") likesFromRes = res;
          else if (res.likes != null) likesFromRes = res.likes;
          else if (res.data && res.data.likes != null)
            likesFromRes = res.data.likes;
          else if (res.items && res.items.likes != null)
            likesFromRes = res.items.likes;
        }
        if (likesFromRes != null) {
          setLikeCounts((lc) => ({ ...lc, [id]: Number(likesFromRes) }));
        }
      } catch (err) {
        console.error("Erro ao descurtir bebida", err);
        // Rollback on failure
        setFavorites((p) => ({ ...p, [id]: prevFav }));
        setLikeCounts((lc) => ({ ...lc, [id]: prevLike }));
      }
    }
  };

  // Persist favorites in localStorage so like/unlike persists per session
  const FAVORITES_KEY = "cardapio:favorites";
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setFavorites(parsed);
      }
    } catch (e) {
      console.warn("Failed to load favorites from localStorage", e);
    }
  }, []);

  const isFirstSave = useRef(true);
  useEffect(() => {
    // Skip saving on first render to avoid overwriting loaded value
    if (isFirstSave.current) {
      isFirstSave.current = false;
      return;
    }
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn("Failed to save favorites to localStorage", e);
    }
  }, [favorites]);
  const toggleComment = (id) => setComments((p) => ({ ...p, [id]: !p[id] }));

  // inline comment form state
  const [openInlineId, setOpenInlineId] = useState(null);
  const [inlineTexto, setInlineTexto] = useState("");
  const [inlineNota, setInlineNota] = useState(5);
  const [inlineAutor, setInlineAutor] = useState("");
  const [inlineSubmitting, setInlineSubmitting] = useState(false);
  const [inlineHasCommented, setInlineHasCommented] = useState(false);
  const [inlineComment, setInlineComment] = useState(null);
  const [inlineEditing, setInlineEditing] = useState(false);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState({
    bebidaId: null,
    id: null,
    texto: "",
    nota: 5,
    autor: "",
  });
  const [geoError, setGeoError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [geoConsentOpen, setGeoConsentOpen] = useState(false);
  const [geoConsentPending, setGeoConsentPending] = useState(null);

  const COMMENTS_KEY = "cardapio:comments";

  useEffect(() => {
    if (!openInlineId) {
      setInlineHasCommented(false);
      setInlineComment(null);
      setInlineEditing(false);
      return;
    }
    try {
      const raw = localStorage.getItem(COMMENTS_KEY);
      const map = raw ? JSON.parse(raw) : {};
      const stored = map[String(openInlineId)];
      if (stored && typeof stored === "object") {
        setInlineComment(stored);
        setInlineHasCommented(true);
        setInlineTexto(stored.texto || "");
        setInlineNota(stored.nota || 5);
        setInlineAutor(stored.autor || "");
        setInlineEditing(false);
      } else if (stored) {
        // legacy boolean marker
        setInlineHasCommented(true);
        setInlineComment(null);
        setInlineEditing(false);
      } else {
        setInlineHasCommented(false);
        setInlineComment(null);
      }
    } catch (e) {
      setInlineHasCommented(false);
    }
  }, [openInlineId]);

  const handleToggleInline = (id) => {
    if (openInlineId === id) {
      setOpenInlineId(null);
    } else {
      setOpenInlineId(id);
      // if we have a stored comment, fields will be populated by effect
      setInlineTexto("");
      setInlineNota(5);
      setInlineAutor("");
      setInlineEditing(false);
    }
  };

  const handleInlineSubmit = async (b) => {
    if (!inlineTexto || inlineNota < 1 || inlineNota > 5) return;
    // prepare payload and open consent dialog
    const payload = {
      texto: inlineTexto,
      nota: inlineNota,
      autor: inlineAutor || null,
    };
    setGeoConsentPending({ mode: "inline", bebida: b, payload });
    setGeoConsentOpen(true);
  };

  // perform the pending submit (inline or edit), optionally with geolocation
  const performPendingSubmit = async (pending, withGeo) => {
    if (!pending) return;
    const { mode, bebida, payload, editData } = pending;
    try {
      if (withGeo && navigator.geolocation) {
        const pos = await new Promise((resolve) => {
          let settled = false;
          const timer = setTimeout(() => {
            if (!settled) {
              settled = true;
              resolve(null);
            }
          }, 8000);
          navigator.geolocation.getCurrentPosition(
            (p) => {
              if (settled) return;
              settled = true;
              clearTimeout(timer);
              resolve({
                latitude: p.coords.latitude,
                longitude: p.coords.longitude,
              });
            },
            () => {
              if (settled) return;
              settled = true;
              clearTimeout(timer);
              resolve(null);
            },
            { enableHighAccuracy: false, timeout: 7000 }
          );
        });
        if (pos) {
          payload.latitude = pos.latitude;
          payload.longitude = pos.longitude;
          setGeoError(null);
        } else {
          setGeoError("Geolocalização não disponível ou negada");
        }
      }

      if (mode === "inline") setInlineSubmitting(true);

      let saved = null;
      if (mode === "edit") {
        const data = pending.editData;
        if (data.id) saved = await commentService.update(data.id, payload);
        else saved = await commentService.create(data.bebidaId, payload);
        try {
          const raw = localStorage.getItem(COMMENTS_KEY);
          const map = raw ? JSON.parse(raw) : {};
          if (saved && saved.id) map[String(data.bebidaId)] = saved;
          localStorage.setItem(COMMENTS_KEY, JSON.stringify(map));
        } catch (e) {}
        try {
          const refreshed = await bebidaService.get(data.bebidaId);
          setBebidas((prev) =>
            prev.map((pb) =>
              pb.id === refreshed.id ? { ...pb, ...refreshed } : pb
            )
          );
          // confetti on successful edit
          try {
            if (saved && saved.id) launchConfetti(100);
          } catch (e) {}
        } catch (e) {}
      } else {
        const b = pending.bebida;
        if (inlineComment && inlineComment.id && inlineEditing) {
          saved = await commentService.update(inlineComment.id, payload);
        } else if (inlineComment && inlineComment.id && !inlineEditing) {
          saved = inlineComment;
        } else {
          saved = await commentService.create(b.id, payload);
        }
        try {
          const raw = localStorage.getItem(COMMENTS_KEY);
          const map = raw ? JSON.parse(raw) : {};
          map[String(b.id)] = saved || true;
          localStorage.setItem(COMMENTS_KEY, JSON.stringify(map));
          setInlineHasCommented(true);
          setInlineComment(saved || null);
        } catch (e) {
          console.warn("Failed to save comment locally", e);
        }
        try {
          const refreshed = await bebidaService.get(b.id);
          setBebidas((prev) =>
            prev.map((pb) =>
              pb.id === refreshed.id ? { ...pb, ...refreshed } : pb
            )
          );
          // confetti on successful create/update
          try {
            if (saved && saved.id) launchConfetti(100);
          } catch (e) {}
        } catch (e) {
          console.warn("Failed to refresh bebida after comment", e);
        }
        setInlineTexto("");
        setInlineAutor("");
        setInlineNota(5);
        setOpenInlineId(null);
      }
    } catch (e) {
      console.error("Failed to perform pending submit", e);
    } finally {
      if (mode === "inline") setInlineSubmitting(false);
      setGeoConsentPending(null);
      setGeoConsentOpen(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [catsRes, bebsRes] = await Promise.all([
          categoriaService.list(),
          bebidaService.list(),
        ]);
        if (!mounted) return;

        const normalize = (res) => {
          if (Array.isArray(res)) return res;
          if (!res) return [];
          if (Array.isArray(res.data)) return res.data;
          if (Array.isArray(res.items)) return res.items;
          return [];
        };

        const cats = normalize(catsRes);
        const bebs = normalize(bebsRes);

        setCategorias(cats);
        setBebidas(bebs);

        const counts = {};
        (Array.isArray(bebs) ? bebs : []).forEach((b) => {
          const id = b?.id || b?._id || b?.nome;
          counts[id] = Number(b?.likes || 0);
        });
        setLikeCounts(counts);
        // reset selected tab to 0 (first category) after load
        setSelectedTab(0);
      } catch (err) {
        console.error("Erro ao carregar categorias/bebidas", err);
        setCategorias([]);
        setBebidas([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Tabs / filtering helpers
  const hasUncategorized = bebidas.some(
    (b) => !(b.categoria_id || b.categoria?.id || b.categoria)
  );
  const categoryTabs = [...categorias];
  if (hasUncategorized) {
    categoryTabs.push({ id: "_nao_classificado", nome: "Outros" });
  }

  // Decide which navigation to use: TabBar when there are more than 4 categories
  const useTabBar = categoryTabs.length > 4;

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const selectedCategory = categoryTabs[selectedTab];
  const filteredBebidas = bebidas.filter((b) => {
    if (!selectedCategory) return true;
    if (selectedCategory.id === "_nao_classificado") {
      return !(b.categoria_id || b.categoria?.id || b.categoria);
    }
    return (
      b.categoria_id === selectedCategory.id ||
      b.categoria?.id === selectedCategory.id ||
      b.categoria === selectedCategory.id ||
      b.categoria?.nome === selectedCategory.nome
    );
  });
  return (
    <Box
      sx={{
        width: "calc(100vw - 0px)",
        backgroundColor: "background.default",
        minHeight: "100vh",
        backgroundImage: `url(${mode === "dark" ? fundoDark : fundoLight})`,
        backgroundSize: "contain",
        backgroundPosition: "left top",
        backgroundRepeat: "repeat",
        backgroundAttachment: "scroll",
        backgroundOrigin: "padding-box",
        backgroundClip: "border-box",
        position: "relative",
      }}
    >
      {/* AppBar transparente apenas para posicionar o botão de tema */}
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          backgroundColor:
            mode === "dark" ? "background.paper" : "primary.main",
          color: mode === "dark" ? "text.primary" : "primary.contrastText",
          boxShadow: 1,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src="/static/logo.png"
            alt="logo"
            sx={{ height: 40, ml: 1 }}
          />

          <IconButton
            color="inherit"
            onClick={() => toggleMode()}
            aria-label="toggle theme"
          >
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Desktop: Tabs in sticky Paper below AppBar */}
      {!isMobile && categoryTabs.length > 0 ? (
        <Paper
          elevation={1}
          sx={{
            position: "sticky",
            top: 64,
            zIndex: 1100,
            // bgcolor: "background.paper",
            borderBottom: 1,
            borderRadius: 0,
            backgroundColor:
              mode === "dark" ? "background.paper" : "primary.main",
            color: mode === "dark" ? "text.primary" : "white",
            borderColor: "divider",
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant={categoryTabs.length > 6 ? "scrollable" : "standard"}
                scrollButtons="auto"
                centered={categoryTabs.length <= 6}
                aria-label="Categorias"
                sx={{ width: "100%", maxWidth: 920 }}
                textColor="white"
                indicatorColor="secondary"
              >
                {categoryTabs.map((cat, idx) => (
                  <Tab
                    key={cat.id || idx}
                    icon={<LocalCafe sx={{ width: 14, height: 14 }} />}
                    iconPosition="start"
                    label={cat.nome}
                    // sx={{ color: "white" }}
                  />
                ))}
              </Tabs>
            </Box>
          </Container>
        </Paper>
      ) : null}

      {/* Category navigation: BottomNavigation only on mobile */}

      <LayoutGroup>
        <Container maxWidth="lg" sx={{ pb: isMobile ? 8 : 3 }}>
          <Box sx={{ py: 4 }}>
            {filteredBebidas.length === 0 ? (
              <Typography color="text.secondary">
                Nenhuma bebida nesta categoria.
              </Typography>
            ) : (
              <Grid container spacing={1}>
                {filteredBebidas.map((b, idx) => {
                  const id = idFromB(b) || b.nome;
                  const imgSrc =
                    b.imagem_url ||
                    b.imagem?.url ||
                    b.thumb_url ||
                    "/static/no-image.png";
                  const userCommentedLocally = (() => {
                    try {
                      const raw = localStorage.getItem(COMMENTS_KEY);
                      const map = raw ? JSON.parse(raw) : {};
                      return !!map[String(id)];
                    } catch (e) {
                      return false;
                    }
                  })();
                  return (
                    <Grow in={true} timeout={300 + idx * 100} key={id}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        sx={{
                          width: "100%",
                          [theme.breakpoints.up("md")]: {
                            flexBasis: `calc((100% - ${theme.spacing(
                              1
                            )} * 1) / 4)`,
                            maxWidth: `calc((100% - ${theme.spacing(
                              1
                            )} * 1) / 4)`,
                          },
                        }}
                      >
                        <Card
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            height: "100%",
                            width: "100%",
                            position: "relative",
                            overflow: "hidden",
                          }}
                          elevation={4}
                        >
                          {imgSrc ? (
                            <motion.div
                              layoutId={`image-${id}`}
                              style={{ width: "100%", overflow: "hidden" }}
                            >
                              <CardMedia
                                component="img"
                                height="200"
                                image={imgSrc}
                                alt={b.nome}
                                onClick={() => handleOpenImage(b)}
                                sx={{ cursor: "pointer" }}
                              />
                            </motion.div>
                          ) : null}

                          <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                                mb: 1,
                                gap: 2,
                              }}
                            >
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {b.nome}
                              </Typography>
                            </Box>

                            <Typography variant="body2" color="text.secondary">
                              {b.descricao}
                            </Typography>

                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                mt: 2,
                                width: "100%",
                              }}
                            >
                              <Tooltip
                                title={favorites[id] ? "Descurtir" : "Curtir"}
                              >
                                <Button
                                  size="small"
                                  fullWidth
                                  startIcon={
                                    favorites[id] ? (
                                      <Favorite />
                                    ) : (
                                      <FavoriteBorder />
                                    )
                                  }
                                  color={favorites[id] ? "error" : "default"}
                                  onClick={() => toggleFavorite(id, b)}
                                  aria-label="Curtir"
                                >
                                  <span style={{ whiteSpace: "nowrap" }}>
                                    Like ({likeCounts[id] || 0})
                                  </span>
                                </Button>
                              </Tooltip>

                              <Button
                                variant="text"
                                size="small"
                                fullWidth
                                startIcon={
                                  userCommentedLocally ? (
                                    <RecordVoiceOver />
                                  ) : (
                                    <ChatBubbleOutline />
                                  )
                                }
                                onClick={() => handleToggleInline(id)}
                              >
                                {userCommentedLocally ? "Comentei" : "Opinar"}
                              </Button>

                              <Button
                                variant="text"
                                size="small"
                                fullWidth
                                startIcon={<ChatBubble />}
                                onClick={() =>
                                  setComments((p) => ({ ...p, [id]: true }))
                                }
                              >
                                Ver
                              </Button>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                                mt: 1,
                              }}
                            >
                              {b.avg_rating != null ? (
                                <>
                                  <Rating
                                    name={`rating-${id}`}
                                    value={Number(b.avg_rating)}
                                    precision={0.5}
                                    readOnly
                                    max={5}
                                    size="small"
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {Number(b.avg_rating).toFixed(2)}
                                  </Typography>
                                </>
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Ainda não avaliado
                                </Typography>
                              )}

                              <Divider
                                orientation="vertical"
                                flexItem
                                sx={{ mx: 1 }}
                              />

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {(Number(b.comments_count) || 0) === 1
                                  ? `${Number(
                                      b.comments_count || 0
                                    )} comentário`
                                  : `${Number(
                                      b.comments_count || 0
                                    )} comentários`}
                              </Typography>
                            </Box>
                          </CardContent>
                          <Collapse
                            in={openInlineId === id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ p: 2, width: "100%" }}>
                              {inlineHasCommented ? (
                                <Box>
                                  {inlineComment ? (
                                    <Box sx={{ mb: 1 }}>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          gap: 1,
                                          alignItems: "center",
                                        }}
                                      >
                                        <Rating
                                          value={Number(inlineComment.nota)}
                                          readOnly
                                          size="small"
                                        />
                                        <Typography variant="subtitle2">
                                          {inlineComment.autor || "Anônimo"}
                                        </Typography>
                                      </Box>
                                      <Typography
                                        variant="body2"
                                        color="text.primary"
                                        sx={{ my: 1 }}
                                      >
                                        {inlineComment.texto}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        {inlineComment.created_at
                                          ? new Date(
                                              inlineComment.created_at
                                            ).toLocaleString()
                                          : ""}
                                      </Typography>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          gap: 1,
                                          mt: 1,
                                        }}
                                      >
                                        {!inlineEditing ? (
                                          <>
                                            <Button
                                              size="small"
                                              onClick={() => {
                                                // open edit modal prefilled
                                                setEditModalData({
                                                  bebidaId: b.id,
                                                  id: inlineComment?.id || null,
                                                  texto:
                                                    inlineComment?.texto || "",
                                                  nota:
                                                    inlineComment?.nota || 5,
                                                  autor:
                                                    inlineComment?.autor || "",
                                                });
                                                setEditModalOpen(true);
                                              }}
                                            >
                                              Editar
                                            </Button>
                                            <Button
                                              size="small"
                                              onClick={async () => {
                                                // remove comment
                                                if (
                                                  !inlineComment ||
                                                  !inlineComment.id
                                                )
                                                  return;
                                                try {
                                                  await commentService.remove(
                                                    inlineComment.id
                                                  );
                                                  const raw =
                                                    localStorage.getItem(
                                                      COMMENTS_KEY
                                                    );
                                                  const map = raw
                                                    ? JSON.parse(raw)
                                                    : {};
                                                  delete map[String(b.id)];
                                                  localStorage.setItem(
                                                    COMMENTS_KEY,
                                                    JSON.stringify(map)
                                                  );
                                                  setInlineHasCommented(false);
                                                  setInlineComment(null);
                                                  // fechar o painel inline após remover
                                                  setOpenInlineId(null);
                                                  // mostrar toast de sucesso
                                                  setSnackbar({
                                                    open: true,
                                                    message:
                                                      "Comentário removido",
                                                    severity: "success",
                                                  });
                                                  // refresh aggregates
                                                  const refreshed =
                                                    await bebidaService.get(
                                                      b.id
                                                    );
                                                  setBebidas((prev) =>
                                                    prev.map((pb) =>
                                                      pb.id === refreshed.id
                                                        ? {
                                                            ...pb,
                                                            ...refreshed,
                                                          }
                                                        : pb
                                                    )
                                                  );
                                                } catch (e) {
                                                  console.error(
                                                    "Failed to remove comment",
                                                    e
                                                  );
                                                }
                                              }}
                                            >
                                              Remover
                                            </Button>
                                          </>
                                        ) : (
                                          <>
                                            <Button
                                              size="small"
                                              onClick={() =>
                                                setInlineEditing(false)
                                              }
                                            >
                                              Cancelar
                                            </Button>
                                            <Button
                                              size="small"
                                              variant="contained"
                                              onClick={() =>
                                                handleInlineSubmit(b)
                                              }
                                              disabled={
                                                inlineSubmitting || !inlineTexto
                                              }
                                            >
                                              Salvar
                                            </Button>
                                          </>
                                        )}
                                      </Box>
                                    </Box>
                                  ) : (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Você já comentou este produto.
                                    </Typography>
                                  )}
                                </Box>
                              ) : (
                                <>
                                  <TextField
                                    label="Seu nome (opcional)"
                                    value={inlineAutor}
                                    onChange={(e) =>
                                      setInlineAutor(e.target.value)
                                    }
                                    fullWidth
                                    size="small"
                                    sx={{ mb: 1 }}
                                  />
                                  <TextField
                                    label="Comentário"
                                    value={inlineTexto}
                                    onChange={(e) =>
                                      setInlineTexto(e.target.value)
                                    }
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    sx={{ mb: 1 }}
                                  />
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 1,
                                      alignItems: "center",
                                      mb: 1,
                                    }}
                                  >
                                    <Typography variant="body2">
                                      Nota
                                    </Typography>
                                    <Rating
                                      value={inlineNota}
                                      onChange={(e, v) => setInlineNota(v || 5)}
                                      max={5}
                                    />
                                  </Box>
                                  <Button
                                    variant="contained"
                                    onClick={() => handleInlineSubmit(b)}
                                    disabled={inlineSubmitting || !inlineTexto}
                                    fullWidth
                                  >
                                    {inlineSubmitting ? (
                                      <CircularProgress size={18} />
                                    ) : (
                                      "Enviar"
                                    )}
                                  </Button>
                                </>
                              )}
                            </Box>
                          </Collapse>

                          {comments[id] ? (
                            <CommentsPanel
                              bebidaId={b.id}
                              open={!!comments[id]}
                              viewOnly={true}
                              onClose={() =>
                                setComments((p) => ({ ...p, [id]: false }))
                              }
                              onCommentPosted={(updatedBebida) => {
                                // update bebida aggregates in state
                                setBebidas((prev) =>
                                  prev.map((pb) =>
                                    pb.id === updatedBebida.id
                                      ? { ...pb, ...updatedBebida }
                                      : pb
                                  )
                                );
                              }}
                            />
                          ) : null}
                        </Card>
                      </Grid>
                    </Grow>
                  );
                })}
              </Grid>
            )}
          </Box>
        </Container>
        <MenuDetail
          item={activeItem}
          open={detailOpen}
          onClose={handleCloseImage}
        />
      </LayoutGroup>
      {/* Bottom navigation rendered via Portal to document.body for complete stability */}
      {isMobile &&
        categoryTabs.length > 0 &&
        typeof document !== "undefined" &&
        createPortal(
          <Paper
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 0,
              isolation: "isolate",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
            elevation={8}
          >
            <BottomNavigation
              showLabels
              value={selectedTab}
              onChange={(e, newValue) => setSelectedTab(newValue)}
            >
              {categoryTabs.map((cat, idx) => (
                <BottomNavigationAction
                  key={cat.id || idx}
                  label={cat.nome}
                  icon={idx === selectedTab ? <LocalCafe /> : undefined}
                  value={idx}
                />
              ))}
            </BottomNavigation>
          </Paper>,
          document.body
        )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* Geolocation consent dialog */}
      <Dialog
        open={geoConsentOpen}
        onClose={() => {
          setGeoConsentOpen(false);
          setGeoConsentPending(null);
        }}
        fullWidth
        maxWidth="xs"
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Enviar geolocalização?</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            📍 Sua localização ajuda a identificar a loja responsável pelo
            atendimento e é importante para melhorarmos sua experiência. Deseja
            permitir a geolocalização?
          </Typography>
          <Box
            sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 2 }}
          >
            <Button
              onClick={() => {
                setGeoConsentOpen(false);
                setGeoConsentPending(null);
              }}
            >
              CANCELAR
            </Button>
            <Button
              onClick={() => {
                performPendingSubmit(geoConsentPending, false);
              }}
            >
              NÃO
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                performPendingSubmit(geoConsentPending, true);
              }}
            >
              SIM
            </Button>
          </Box>
        </Box>
      </Dialog>
      {/* Edit comment modal / bottom sheet on mobile */}
      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
        >
          <Box
            sx={{
              p: 2,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Editar seu comentário
            </Typography>
            <TextField
              label="Seu nome (opcional)"
              value={editModalData.autor}
              onChange={(e) =>
                setEditModalData((d) => ({ ...d, autor: e.target.value }))
              }
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <TextField
              label="Comentário"
              value={editModalData.texto}
              onChange={(e) =>
                setEditModalData((d) => ({ ...d, texto: e.target.value }))
              }
              fullWidth
              multiline
              minRows={4}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
              <Typography variant="body2">Nota</Typography>
              <Rating
                value={editModalData.nota}
                onChange={(_, v) =>
                  setEditModalData((d) => ({ ...d, nota: v || 5 }))
                }
                max={5}
              />
            </Box>
            {geoError ? (
              <Typography
                variant="caption"
                color="error"
                sx={{ display: "block", mb: 1 }}
              >
                {geoError}
              </Typography>
            ) : null}
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button onClick={() => setEditModalOpen(false)}>Cancelar</Button>
              <Button
                variant="contained"
                onClick={() => {
                  const payload = {
                    texto: editModalData.texto,
                    nota: editModalData.nota,
                    autor: editModalData.autor || null,
                  };
                  setGeoConsentPending({
                    mode: "edit",
                    editData: editModalData,
                    payload,
                  });
                  setGeoConsentOpen(true);
                  setEditModalOpen(false);
                }}
              >
                Confirmar
              </Button>
            </Box>
          </Box>
        </Drawer>
      ) : (
        <Dialog
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Editar seu comentário
            </Typography>
            <TextField
              label="Seu nome (opcional)"
              value={editModalData.autor}
              onChange={(e) =>
                setEditModalData((d) => ({ ...d, autor: e.target.value }))
              }
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <TextField
              label="Comentário"
              value={editModalData.texto}
              onChange={(e) =>
                setEditModalData((d) => ({ ...d, texto: e.target.value }))
              }
              fullWidth
              multiline
              minRows={4}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
              <Typography variant="body2">Nota</Typography>
              <Rating
                value={editModalData.nota}
                onChange={(_, v) =>
                  setEditModalData((d) => ({ ...d, nota: v || 5 }))
                }
                max={5}
              />
            </Box>
            {geoError ? (
              <Typography
                variant="caption"
                color="error"
                sx={{ display: "block", mb: 1 }}
              >
                {geoError}
              </Typography>
            ) : null}
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button onClick={() => setEditModalOpen(false)}>Cancelar</Button>
              <Button
                variant="contained"
                onClick={() => {
                  const payload = {
                    texto: editModalData.texto,
                    nota: editModalData.nota,
                    autor: editModalData.autor || null,
                  };
                  setGeoConsentPending({
                    mode: "edit",
                    editData: editModalData,
                    payload,
                  });
                  setGeoConsentOpen(true);
                  setEditModalOpen(false);
                }}
              >
                Confirmar
              </Button>
            </Box>
          </Box>
        </Dialog>
      )}
    </Box>
  );
};

export default Cardapio;
