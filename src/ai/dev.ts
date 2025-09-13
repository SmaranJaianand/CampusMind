import { config } from 'dotenv';
config();

import '@/ai/flows/generate-initial-response.ts';
import '@/ai/flows/triage-user-need.ts';