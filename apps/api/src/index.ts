import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);
const JWT_SECRET = process.env.JWT_SECRET ?? 'tourmatch-dev-secret';

app.use(cors());
app.use(express.json());

const touristSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).optional(),
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
  password: z.string().min(6).optional(),
  city: z.string().min(2),
  specialties: z.array(z.string()),
  languages: z.array(z.string()),
  hourlyRate: z.number().nonnegative(),
  availability: z.array(z.string()),
  experience: z.string().min(2),
  rating: z.number().min(0).max(5),
  bio: z.string().min(10)
});

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const guiders = [
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
  },
  {
    id: 'guide-3',
    name: 'Mateus Ribeiro',
    city: 'Florianópolis',
    specialties: ['nature', 'adventure'],
    languages: ['pt-BR', 'fr-FR'],
    hourlyRate: 320,
    availability: ['2026-11-09', '2026-11-11'],
    experience: '9 anos',
    rating: 4.7,
    bio: 'Guia especializado em trilhas, praias e aventuras ao ar livre.'
  }
] as const;

const users = new Map<string, { email: string; passwordHash: string; role: 'tourist' | 'guide'; profile: Record<string, unknown> }>();

const parseStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => (typeof entry === 'string' ? entry.split(',') : []));
  }

  if (typeof value === 'string') {
    return value.split(',').map((entry) => entry.trim()).filter(Boolean);
  }

  return [];
};

const buildToken = (email: string, role: 'tourist' | 'guide') =>
  jwt.sign({ email, role }, JWT_SECRET, { expiresIn: '7d' });

const scoreCompatibility = (tourist: z.infer<typeof touristSchema>, guide: (typeof guiders)[number]) => {
  let score = 40;
  const reasons: string[] = ['Base de compatibilidade inicial'];

  if (guide.city.toLowerCase().includes(tourist.destination.toLowerCase())) {
    score += 25;
    reasons.push('Destino alinhado com a cidade do guia');
  }

  const sharedLanguages = tourist.languages.filter((language) => guide.languages.includes(language as never));
  if (sharedLanguages.length > 0) {
    score += 20;
    reasons.push(`Idioma compatível: ${sharedLanguages.join(', ')}`);
  }

  const sharedInterests = tourist.interests.filter((interest) => guide.specialties.includes(interest as never));
  if (sharedInterests.length > 0) {
    score += 25;
    reasons.push(`Interesses em comum: ${sharedInterests.join(', ')}`);
  }

  if (guide.hourlyRate <= tourist.budget) {
    score += 10;
    reasons.push('Faixa de preço compatível com o orçamento');
  } else {
    score -= 10;
    reasons.push('Preço acima do orçamento informado');
  }

  if (guide.rating >= 4.5) {
    score += 10;
    reasons.push('Boa avaliação e reputação');
  }

  return {
    guideId: guide.id,
    score: Math.max(0, Math.min(100, score)),
    reasons: [...new Set(reasons)].slice(0, 4)
  };
};

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'tourmatch-api' });
});

app.post('/api/auth/register/tourist', async (req, res) => {
  const parsed = touristSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: 'Dados do turista inválidos', details: parsed.error.flatten() });
  }

  const { email, password = 'tourmatch123', ...profile } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 10);
  users.set(email, { email, passwordHash, role: 'tourist', profile });

  return res.status(201).json({
    ok: true,
    token: buildToken(email, 'tourist'),
    user: { email, role: 'tourist', profile }
  });
});

app.post('/api/auth/register/guide', async (req, res) => {
  const parsed = guideSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: 'Dados do guia inválidos', details: parsed.error.flatten() });
  }

  const { email, password = 'tourmatch123', ...profile } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 10);
  users.set(email, { email, passwordHash, role: 'guide', profile });

  return res.status(201).json({
    ok: true,
    token: buildToken(email, 'guide'),
    user: { email, role: 'guide', profile }
  });
});

app.post('/api/auth/login', async (req, res) => {
  const parsed = authSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: 'Credenciais inválidas', details: parsed.error.flatten() });
  }

  const user = users.get(parsed.data.email);
  if (!user) {
    return res.status(401).json({ error: 'Usuário não encontrado' });
  }

  const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }

  return res.json({
    ok: true,
    token: buildToken(user.email, user.role),
    user: { email: user.email, role: user.role }
  });
});

app.post('/api/tourists', async (req, res) => {
  const parsed = touristSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: 'Dados do turista inválidos', details: parsed.error.flatten() });
  }

  const { email, password = 'tourmatch123', ...profile } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 10);
  users.set(email, { email, passwordHash, role: 'tourist', profile });

  return res.status(201).json({ ok: true, tourist: profile, token: buildToken(email, 'tourist') });
});

app.post('/api/guides', async (req, res) => {
  const parsed = guideSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: 'Dados do guia inválidos', details: parsed.error.flatten() });
  }

  const { email, password = 'tourmatch123', ...profile } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 10);
  users.set(email, { email, passwordHash, role: 'guide', profile });

  return res.status(201).json({ ok: true, guide: profile, token: buildToken(email, 'guide') });
});

app.get('/api/matches', (req, res) => {
  const destination = typeof req.query.destination === 'string' ? req.query.destination : undefined;
  const budget = typeof req.query.budget === 'string' ? Number(req.query.budget) : undefined;
  const interests = parseStringArray(req.query.interests);
  const languages = parseStringArray(req.query.languages);

  const mockTourist: z.infer<typeof touristSchema> = {
    name: 'Turista demo',
    email: 'turista@demo.com',
    destination: destination ?? 'Rio de Janeiro',
    period: 'novembro',
    budget: budget ?? 300,
    languages: languages.length > 0 ? languages : ['pt-BR', 'en-US'],
    interests: interests.length > 0 ? interests : ['historical', 'cultural'],
    experienceType: 'Tour cultural',
    maxDistanceKm: 30
  };

  const matches = guiders
    .map((guide) => {
      const guideData = guiders.find((item) => item.id === guide.id);
      const matchesDestination = destination ? guide.city.toLowerCase().includes(destination.toLowerCase()) : true;
      const matchesBudget = budget ? (guide.hourlyRate <= budget) : true;
      const matchesLanguage = languages.length > 0 ? languages.some((language) => guide.languages.includes(language as never)) : true;
      const matchesInterest = interests.length > 0 ? interests.some((interest) => guide.specialties.includes(interest as never)) : true;

      return {
        match: scoreCompatibility(mockTourist, guide),
        valid: matchesDestination && matchesBudget && matchesLanguage && matchesInterest,
        guideData
      };
    })
    .filter((entry) => entry.valid)
    .map((entry) => entry.match)
    .sort((a, b) => b.score - a.score);

  return res.json({ matches });
});

app.listen(port, () => {
  console.log(`TourMatch API running at http://localhost:${port}`);
});
