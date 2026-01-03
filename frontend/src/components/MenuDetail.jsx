import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// MenuDetail: Fullscreen modal-like detail view that receives `item` and `onClose`.
// Uses the same `layoutId` for the image so Framer Motion performs a shared element transition.
export default function MenuDetail({ item, open, onClose }) {
  if (!item) return null;
  const id = String(item.id || item._id || item.nome);

  // Thumbnail (source used on card) and candidate original
  const thumbSrc =
    item.imagem_url ||
    item.imagem?.url ||
    item.thumb_url ||
    "/static/no-image.png";

  const inferOriginal = (thumb) => {
    if (!thumb || thumb === "/static/no-image.png") return thumb;
    // prefer explicit original fields
    if (item.original_url) return item.original_url;
    if (item.imagem?.original) return item.imagem.original;

    // common heuristics: replace '/thumb/' -> '/original/', '_thumb' -> '_original', '-thumb' -> '-original'
    let cand = thumb;
    cand = cand.replace(/\/thumbs?\//i, "/original/");
    cand = cand.replace(/_thumb/i, "_original");
    cand = cand.replace(/-thumb/i, "-original");
    if (cand !== thumb) return cand;

    // last resort: replace 'thumb' with 'original'
    const cand2 = thumb.replace(/thumb/gi, "original");
    return cand2;
  };

  const originalCandidate = inferOriginal(thumbSrc);

  const [displaySrc, setDisplaySrc] = useState(thumbSrc);

  useEffect(() => {
    let mounted = true;
    setDisplaySrc(thumbSrc); // start with thumb
    if (originalCandidate && originalCandidate !== thumbSrc) {
      const img = new Image();
      img.src = originalCandidate;
      img.onload = () => {
        if (!mounted) return;
        // swap to original once loaded for better quality
        setDisplaySrc(originalCandidate);
      };
      img.onerror = () => {
        // keep thumb if loading original fails
      };
    }
    return () => {
      mounted = false;
    };
  }, [thumbSrc, originalCandidate]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // drag end handler for swipe-down to close on mobile
  const handleDragEnd = (event, info) => {
    const offsetY = info.offset.y || 0;
    const velocityY = info.velocity.y || 0;
    // if user swiped down significantly or with velocity, close
    if (offsetY > 120 || velocityY > 800) {
      onClose();
    }
  };

  // ESC key closes
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
          onClick={onClose}
        >
          <motion.div
            layoutId={`image-${id}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 920,
              // animate border-radius via shared layout
              borderRadius: isMobile ? 0 : 8,
              overflow: "hidden",
              background: "white",
              position: "relative",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            // enable vertical dragging on mobile for swipe-to-close
            {...(isMobile
              ? {
                  drag: "y",
                  dragConstraints: { top: 0, bottom: 0 },
                  dragElastic: 0.6,
                  onDragEnd: handleDragEnd,
                }
              : {})}
          >
            <motion.img
              src={displaySrc}
              alt={item.nome}
              style={{
                display: "block",
                width: "100%",
                height: "60vh",
                objectFit: "cover",
              }}
            />

            <IconButton
              onClick={onClose}
              aria-label="fechar"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "rgba(255,255,255,0.85)",
              }}
            >
              <CloseIcon />
            </IconButton>

            <Box sx={{ p: 2 }}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {item.nome}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {item.descricao}
                </Typography>
              </motion.div>
            </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
