import { useState, useEffect } from "react";
import { Container, Typography, LinearProgress, Stack, Button, Box, Avatar } from "@mui/material";
import QuestionCard, { type Question } from "../components/QuestionCard";
import ResultCard, { type Post } from "../components/ResultCard";
import { useAuthStore } from "../store/authStore";
import { useAlertContext } from "../context/AlertContext";
import { pickPostByCategory, type Answer } from "../utils/matcher";
import { api } from "../services/api";
import Confetti from "react-confetti";

import dancingSeal from "../assets/VirtualAssistant/dancing-seal.gif";

const QUESTIONS: Question[] = [
  {
    text: "¿Qué te inspira más del océano?", options: [
      { text: "Las criaturas marinas 🐠", category: "marine-life" },
      { text: "Los ecosistemas 🌊", category: "ocean-ecosystems" },
      { text: "Explorar 🔬", category: "science-exploration" },
      { text: "Problemas ⚠️", category: "problems-threats" },
      { text: "Regiones 🌍", category: "world-regions" },
    ]
  },
  {
    text: "¿Qué actividad prefieres?", options: [
      { text: "Bucear y ver peces", category: "marine-life" },
      { text: "Estudiar arrecifes", category: "ocean-ecosystems" },
      { text: "Investigar nuevas especies", category: "science-exploration" },
      { text: "Analizar contaminación", category: "problems-threats" },
      { text: "Viajar por océanos del mundo", category: "world-regions" },
    ]
  },
  {
    text: "¿Qué te llama más la atención?", options: [
      { text: "Peces coloridos", category: "marine-life" },
      { text: "Corrientes marinas", category: "ocean-ecosystems" },
      { text: "Innovaciones científicas", category: "science-exploration" },
      { text: "Especies en peligro", category: "problems-threats" },
      { text: "Océanos del Pacífico", category: "world-regions" },
    ]
  },
  {
    text: "¿Cuál sería tu proyecto soñado?", options: [
      { text: "Catalogar especies marinas", category: "marine-life" },
      { text: "Conservar arrecifes", category: "ocean-ecosystems" },
      { text: "Exploración submarina", category: "science-exploration" },
      { text: "Campaña contra plásticos", category: "problems-threats" },
      { text: "Mapa de océanos", category: "world-regions" },
    ]
  },
  {
    text: "Tu color favorito en el océano", options: [
      { text: "Azul turquesa", category: "marine-life" },
      { text: "Azul profundo", category: "ocean-ecosystems" },
      { text: "Verde científico", category: "science-exploration" },
      { text: "Gris contaminado", category: "problems-threats" },
      { text: "Azul global", category: "world-regions" },
    ]
  },
  {
    text: "¿Qué animal te representa?", options: [
      { text: "Pez payaso", category: "marine-life" },
      { text: "Tortuga marina", category: "ocean-ecosystems" },
      { text: "Delfín investigador", category: "science-exploration" },
      { text: "Foca preocupada", category: "problems-threats" },
      { text: "Ballena viajera", category: "world-regions" },
    ]
  },
  {
    text: "Tu lugar favorito", options: [
      { text: "Acuario", category: "marine-life" },
      { text: "Arrecife de coral", category: "ocean-ecosystems" },
      { text: "Laboratorio submarino", category: "science-exploration" },
      { text: "Playa contaminada", category: "problems-threats" },
      { text: "Océano abierto", category: "world-regions" },
    ]
  },
  {
    text: "¿Qué lectura prefieres?", options: [
      { text: "Guías de peces", category: "marine-life" },
      { text: "Ecosistemas marinos", category: "ocean-ecosystems" },
      { text: "Investigación científica", category: "science-exploration" },
      { text: "Problemas medioambientales", category: "problems-threats" },
      { text: "Atlas de océanos", category: "world-regions" },
    ]
  },
  {
    text: "Tu superpoder marino", options: [
      { text: "Nadar rápido", category: "marine-life" },
      { text: "Respirar bajo el agua", category: "ocean-ecosystems" },
      { text: "Detectar nuevas especies", category: "science-exploration" },
      { text: "Limpiar océanos", category: "problems-threats" },
      { text: "Viajar por el mundo", category: "world-regions" },
    ]
  },
  {
    text: "Tu emoji favorito del océano", options: [
      { text: "🐠", category: "marine-life" },
      { text: "🌊", category: "ocean-ecosystems" },
      { text: "🔬", category: "science-exploration" },
      { text: "⚠️", category: "problems-threats" },
      { text: "🌍", category: "world-regions" },
    ]
  },
];

const getDominantCategory = (answers: (Answer | null)[]) => {
  const categoryCount: Record<string, number> = {};

  answers.forEach(ans => {
    if (ans?.category) {
      categoryCount[ans.category] = (categoryCount[ans.category] || 0) + 1;
    }
  });

  let maxCategory = "";
  let maxCount = 0;
  for (const [cat, count] of Object.entries(categoryCount)) {
    if (count > maxCount) {
      maxCount = count;
      maxCategory = cat;
    }
  }

  return maxCategory;
};

const getPositiveMessage = (answers: (Answer | null)[], postCategory?: string) => {
  const dominantCategory = getDominantCategory(answers) || postCategory;

  switch (dominantCategory) {
    case "marine-life":
      return "¡Eres un amante de la vida marina! 🐠";
    case "ocean-ecosystems":
      return "Tu pasión por los ecosistemas marinos es inspiradora 🌊";
    case "science-exploration":
      return "Eres un verdadero explorador científico 🔬";
    case "problems-threats":
      return "Estás muy comprometido con el cuidado de los océanos ⚠️";
    case "world-regions":
      return "Tu curiosidad por el mundo es asombrosa 🌍";
    default:
      return "¡Has completado el test! 🌊";
  }
};

export default function TestGamePage() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(Answer | null)[]>(Array(QUESTIONS.length).fill(null));
  const [resultPost, setResultPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlertContext();
  const isAuthenticated = useAuthStore((state) => !!state.token);
 
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await api.get<{ data: Post[] }>("/api/posts");
        const postsData = res.data.data || [];
        setPosts(postsData);
        
        if (postsData.length > 0) {
          console.log("📝 Posts cargados:", postsData.length);
          console.log("🖼️ Primer post:", {
            id: postsData[0].id,
            title: postsData[0].title,
            image_url: postsData[0].image_url,
            hasImage: !!postsData[0].image_url
          });
        }
        
      } catch (err) {
        console.error("Error fetching posts:", err);
        showAlert("No se pudieron cargar los posts. Intenta más tarde", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [showAlert]);

  const handleAnswer = (optionIndex: number, option: { text: string; category: string }) => {
    const newAnswers = [...answers];
    newAnswers[index] = { index: optionIndex, category: option.category };
    setAnswers(newAnswers);
  };

  const handleNext = () => setIndex((prev) => Math.min(prev + 1, QUESTIONS.length - 1));
  const handlePrev = () => setIndex((prev) => Math.max(prev - 1, 0));

  const handleFinish = () => {
    if (!isAuthenticated) {
      showAlert("Debes iniciar sesión para hacer el test 🦭", "warning");
      return;
    }

    const unansweredQuestions = answers.filter(answer => answer === null).length;
    if (unansweredQuestions > 0) {
      showAlert(`Tienes ${unansweredQuestions} preguntas sin responder`, "warning");
      return;
    }

    const chosen = pickPostByCategory(answers.filter(Boolean) as Answer[], posts);
    
    console.log("🎯 Post elegido:", chosen);
    
    setResultPost(chosen || null);
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        background: "linear-gradient(180deg, #0077be 0%, #00cfff 100%)"
      }}>
        <Typography variant="h5" color="#fff">
          Cargando... 🌊
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0077be 0%, #00cfff 100%)",
        backgroundSize: "200% 200%",
        animation: "wave 10s ease-in-out infinite",
        overflow: "hidden",
        py: 5,
      }}
    >
      <style>
        {`
          @keyframes wave {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <Container sx={{ textAlign: "center", position: "relative" }}>
        <Typography variant="h4" mb={2} color="#fff" sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          🌊 ¿Qué post eres?
        </Typography>

        {!resultPost && (
          <LinearProgress
            variant="determinate"
            value={((index + 1) / QUESTIONS.length) * 100}
            sx={{ 
              mb: 3, 
              height: 10, 
              borderRadius: 5,
              backgroundColor: "rgba(255,255,255,0.3)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#00ff9d"
              }
            }}
          />
        )}

        {!resultPost ? (
          <>
            <QuestionCard
              question={QUESTIONS[index]}
              onAnswer={handleAnswer}
              selectedIndex={answers[index]?.index ?? null}
            />
            <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
              <Button
                onClick={handlePrev}
                disabled={index === 0}
                variant="contained"
                sx={{ 
                  backgroundColor: "#fff", 
                  color: "#0077be",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  }
                }}
              >
                Atrás
              </Button>
              {index < QUESTIONS.length - 1 ? (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{
                    backgroundColor: "#00cfff",
                    color: "#fff",
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#00b8e6",
                      transform: "scale(1.05)",
                    },
                    transition: "transform 0.2s ease, background-color 0.3s ease",
                  }}
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  variant="contained"
                  sx={{
                    backgroundColor: "#00ff9d",
                    color: "#0077be",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#00e68a",
                      transform: "scale(1.05)",
                    },
                    transition: "transform 0.2s ease, background-color 0.3s ease",
                  }}
                >
                  Ver resultado
                </Button>
              )}
            </Stack>
          </>
        ) : (
          <Box
            sx={{
              mt: 5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <Confetti width={window.innerWidth} height={window.innerHeight} />
            <Avatar
              src={dancingSeal}
              sx={{
                width: { xs: 100, sm: 120, md: 150 },
                height: { xs: 100, sm: 120, md: 150 },
                mb: 2,
                border: "3px solid #fff",
                boxShadow: "0 0 15px rgba(0,0,0,0.3)",
                mx: "auto",
              }}
            />
            <Typography variant="h5" mb={3} color="#fff" sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              {getPositiveMessage(answers, resultPost?.category)}
            </Typography>

            {resultPost && (
              <Box
                sx={{
                  width: { xs: "90%", sm: "60%", md: "40%" },
                  transition: "transform 0.3s ease",
                }}
              >
                <ResultCard post={resultPost} />
              </Box>
            )}

            <Button
              sx={{
                mt: 3,
                backgroundColor: "#fff",
                color: "#0077be",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                }
              }}
              onClick={() => {
                setIndex(0);
                setAnswers(Array(QUESTIONS.length).fill(null));
                setResultPost(null);
              }}
            >
              Rehacer test
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}