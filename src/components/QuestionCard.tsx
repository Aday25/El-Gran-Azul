import { Card, CardContent, Typography, Button, Stack } from "@mui/material";
import React from 'react';

export interface Option {
  text: string;
  category: string;
}

export interface Question {
  text: string;
  options: Option[];
}

interface QuestionCardProps {
  question: Question;
  onAnswer: (index: number, option: Option) => void;
  selectedIndex: number | null;
}

export default function QuestionCard({
  question,
  onAnswer,
  selectedIndex,
}: QuestionCardProps): React.JSX.Element {
  return (
    <Card sx={{ maxWidth: 700, mx: "auto", p: 2, borderRadius: 3, background: "#e1f5fe" }}>
      <CardContent>
        <Typography variant="h6" mb={2}>
          {question.text}
        </Typography>
        <Stack spacing={1}>
          {question.options.map((opt, i) => (
            <Button
              key={i}
              variant={selectedIndex === i ? "contained" : "outlined"}
              onClick={() => onAnswer(i, opt)}
              sx={{
                justifyContent: "flex-start",
                borderRadius: 2,
                textTransform: "none",
                transition: "transform 0.2s ease, box-shadow 0.3s ease",
                "&:hover": { transform: "scale(1.05)", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }
              }}
            >
              {opt.text}
            </Button>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}