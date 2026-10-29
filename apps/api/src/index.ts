import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

const touristSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  destination: z.string().min(2),
  period: z.string().min(2),
  budget: z.number().nonnegative(),
  languages: z.array(z.string()),
  interests: z.array(z.string()),
  experienceType: z.string().min(2),
  maxDistanceKm: z.number().nonnegative()
});

const guideSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  city: z.string().min(2),
  specialties: z.array(z.string()),
  languages: z.array(z.string()),
  hourlyRate: z.number().nonnegative(),
  availability: z.array(z.string()),
  experience: z.string().min(2),
  rating: z.number().min(0).max(5),
  bio: z.string().min(10)
});

const touristGuides = [
  {
    id: 'guide-1',
    name: 'Luan Costa',
    city: 'Rio de Janeiro',
    specialties: ['historical', 'cultural'],
    languages: ['pt-BR', 'en-US'],
    hourlyRate: 250,
    availability: ['2026-11-10', '2026-11-12'],
    experience: '7 anos',
    rating: 4.8,
    bio: 'Especialista em tours históricos e culturais da cidade.'
  },
  {
    id: 'guide-2',
    name: 'Sofia Almeida',
    city: 'Salvador',
    specialties: ['gastronomic', 'nature'],
    languages: ['pt-BR', 'es-ES'],
    hourlyRate: 180,
    availability: ['2026-11-15'],
    experience: '5 anos',
    rating: 4.9,
    bio: 'Guias gastronômicos e experiências de praia e cultura local.'
  }
];

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'tourmatch-api' });
});

app.post('/api/tourists', (req, res) => {
  const parsed = touristSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: 'Dados do turista inválidos', details: parsed.error.flatten() });
  }

  return res.status(201).json({ ok: true, tourist: parsed.data });
});

app.post('/api/guides', (req, res) => {
  const parsed = guideSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: 'Dados do guia inválidos', details: parsed.error.flatten() });
  }

  return res.status(201).json({ ok: true, guide: parsed.data });
});

const parseStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => (typeof entry === 'string' ? entry.split(',') : []));
  }

  if (typeof value === 'string') {
    return value.split(',').map((entry) => entry.trim()).filter(Boolean);
  }

  return [];
};

app.get('/api/matches', (req, res) => {
  const destination = typeof req.query.destination === 'string' ? req.query.destination : undefined;
  const budget = typeof req.query.budget === 'string' ? Number(req.query.budget) : undefined;
  const interests = parseStringArray(req.query.interests);
  const languages = parseStringArray(req.query.languages);

  const filtered = touristGuides.filter((guide) => {
    const matchesDestination = destination ? guide.city.toLowerCase().includes(destination.toLowerCase()) : true;
    const matchesBudget = budget ? guide.hourlyRate <= budget : true;
    const matchesLanguage = languages.length > 0 ? languages.some((language) => guide.languages.includes(language)) : true;
    const matchesInterest = interests.length > 0 ? interests.some((interest) => guide.specialties.includes(interest)) : true;

    return matchesDestination && matchesBudget && matchesLanguage && matchesInterest;
  });

  res.json({
    matches: filtered.map((guide) => ({
      guideId: guide.id,
      score: 92,
      reasons: ['Idioma compatível', 'Especialidades relacionadas', 'Boa avaliação']
    }))
  });
});

app.listen(port, () => {
  console.log(`TourMatch API running at http://localhost:${port}`);
});
