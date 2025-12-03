import { Backdrop, CircularProgress, Box, Typography, useTheme } from "@mui/material";

interface LoadingOverlayProps {
  open: boolean;
  message?: string;
}

export default function LoadingOverlay({ open, message = "Cargando..." }: LoadingOverlayProps) {
  const theme = useTheme();

  if (!open) return null;

  return (
    <Backdrop
      open={true}
      sx={{
        zIndex: theme.zIndex.modal + 999,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
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
              color: "#00b4d8",
              position: "absolute",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "radial-gradient(circle, transparent 60%, rgba(0, 180, 216, 0.2) 100%)",
              borderRadius: "50%",
              animation: "rotate 2s linear infinite",
              "@keyframes rotate": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
            }}
          />
        </Box>

        {/* Mensaje */}
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontWeight: 500,
            letterSpacing: 1,
            mt: 2,
            maxWidth: "300px",
            animation: "fadeIn 0.5s ease-in",
            "@keyframes fadeIn": {
              "0%": { opacity: 0 },
              "100%": { opacity: 1 },
            },
          }}
        >
          {message}
        </Typography>

        {/* Olas animadas con CSS puro */}
        <Box
          sx={{ 
            display: "flex", 
            mt: 3,
            "& > div": {
              width: 6,
              height: 20,
              backgroundColor: "#00b4d8",
              mx: 0.5,
              borderRadius: "3px",
            },
          }}
        >
          {[0, 1, 2, 3, 4].map((wave) => (
            <Box
              key={wave}
              sx={{
                animation: `wave 1.2s infinite ease-in-out ${wave * 0.15}s`,
                "@keyframes wave": {
                  "0%, 100%": { 
                    transform: "scaleY(1)",
                    opacity: 0.4 
                  },
                  "50%": { 
                    transform: "scaleY(1.5)",
                    opacity: 1 
                  },
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Backdrop>
  );
}