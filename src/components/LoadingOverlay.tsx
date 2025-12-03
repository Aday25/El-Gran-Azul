import { Backdrop, CircularProgress, Box, Typography, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface LoadingOverlayProps {
  open: boolean;
  message?: string;
}

export default function LoadingOverlay({ open, message = "Cargando..." }: LoadingOverlayProps) {
  const theme = useTheme();

  return (
    <AnimatePresence>
      {open && (
        <Backdrop
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          open={open}
          sx={{
            zIndex: theme.zIndex.modal + 999, // Alto z-index para estar sobre todo
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component={motion.div}
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ duration: 0.4, type: "spring" }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {/* Spinner con efecto oceánico */}
            <Box
              sx={{
                position: "relative",
                width: 80,
                height: 80,
                marginBottom: 3,
              }}
            >
              <CircularProgress
                size={80}
                thickness={4}
                sx={{
                  color: "#00b4d8", // Azul oceánico
                  position: "absolute",
                  animationDuration: "1.5s",
                }}
              />
              <Box
                component={motion.div}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "radial-gradient(circle, transparent 60%, rgba(0, 180, 216, 0.2) 100%)",
                  borderRadius: "50%",
                }}
              />
            </Box>

            {/* Mensaje */}
            <Typography
              variant="h6"
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              sx={{
                color: "white",
                fontWeight: 500,
                letterSpacing: 1,
                mt: 2,
                maxWidth: "300px",
              }}
            >
              {message}
            </Typography>

            {/* Olas animadas (opcional) */}
            <Box
              component={motion.div}
              sx={{ display: "flex", mt: 3 }}
            >
              {[0, 1, 2, 3, 4].map((wave) => (
                <Box
                  key={wave}
                  component={motion.div}
                  animate={{ 
                    scaleY: [1, 1.5, 1],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: wave * 0.15,
                  }}
                  sx={{
                    width: 6,
                    height: 20,
                    backgroundColor: "#00b4d8",
                    mx: 0.5,
                    borderRadius: "3px",
                  }}
                />
              ))}
            </Box>
          </Box>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}