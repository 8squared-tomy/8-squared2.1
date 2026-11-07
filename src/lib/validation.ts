import type { TranslationKey } from '@/i18n/translations';
import { z } from 'zod';

export type FieldErrors<T extends string> = Partial<Record<T, TranslationKey>>;

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PHONE_PATTERN = /^\+?[0-9 ()-]{6,25}$/;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  const email = normalizeEmail(value);
  return email.length >= 5 && email.length <= 254 && EMAIL_PATTERN.test(email);
}

function lengthBetween(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}

export const LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'] as const;
export const YEARS = ['under_1', '1_3', '3_5', 'over_5'] as const;
export const TRAINING_TIMES = ['weekday_evenings', 'weekends', 'flexible'] as const;

export type MembershipInput = {
  firstName: string;
  lastName: string;
  email: string;
  university: string;
  level: string;
  yearsPlaying: string;
  trainingTime: string;
};

export function validateMembership(input: MembershipInput): FieldErrors<keyof MembershipInput> {
  const errors: FieldErrors<keyof MembershipInput> = {};
  const first = input.firstName.trim();
  const last = input.lastName.trim();
  const university = input.university.trim();

  if (!lengthBetween(first, 2, 40)) errors.firstName = 'errName';
  if (!lengthBetween(last, 2, 40)) errors.lastName = 'errName';
  if (!isValidEmail(input.email)) errors.email = 'errEmail';
  if (!lengthBetween(university, 2, 120)) errors.university = 'errUniversity';
  if (!(LEVELS as readonly string[]).includes(input.level)) errors.level = 'errLevel';
  if (!(YEARS as readonly string[]).includes(input.yearsPlaying)) errors.yearsPlaying = 'invalidRequired';
  if (!(TRAINING_TIMES as readonly string[]).includes(input.trainingTime)) errors.trainingTime = 'errTrainingTime';

  return errors;
}

export type RegistrationInput = {
  fullName: string;
  email: string;
  university: string;
  phone: string;
  needsAccommodation: boolean;
  residence: string;
  bacRegistrationNumber: string;
};

export const registrationSchema = z.object({
  fullName: z.string().trim().min(2, 'errName').max(100, 'errName'),
  email: z.string().trim().refine(isValidEmail, 'errEmail'),
  university: z.string().trim().min(2, 'errUniversity').max(120, 'errUniversity'),
  needsAccommodation: z.boolean(),
  residence: z.string(),
  bacRegistrationNumber: z.string(),
  phone: z.string(),
}).superRefine((input, ctx) => {
  if (!input.needsAccommodation) return;
  if (!lengthBetween(input.residence.trim(), 2, 120)) ctx.addIssue({ code: 'custom', path: ['residence'], message: 'errResidence' });
  if (!/^\d{1,30}$/.test(input.bacRegistrationNumber.trim())) ctx.addIssue({ code: 'custom', path: ['bacRegistrationNumber'], message: 'errBacNumber' });
  if (!PHONE_PATTERN.test(input.phone.trim())) ctx.addIssue({ code: 'custom', path: ['phone'], message: 'errAccommodationPhone' });
});

export function validateRegistration(input: RegistrationInput): FieldErrors<keyof RegistrationInput> {
  const errors: FieldErrors<keyof RegistrationInput> = {};
  const result = registrationSchema.safeParse(input);
  if (!result.success) for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof RegistrationInput;
    if (!errors[field]) errors[field] = issue.message as TranslationKey;
  }
  return errors;
}

export type EventRegistrationInput = {
  firstName: string;
  lastName: string;
  email: string;
  university: string;
  needsAccommodation: boolean;
  residence: string;
  bacRegistrationNumber: string;
  phone: string;
};

export function validateEventRegistration(input: EventRegistrationInput): FieldErrors<keyof EventRegistrationInput> {
  const errors: FieldErrors<keyof EventRegistrationInput> = {};
  const first = input.firstName.trim();
  const last = input.lastName.trim();
  if (!lengthBetween(first, 2, 40)) errors.firstName = 'errName';
  if (!lengthBetween(last, 2, 40)) errors.lastName = 'errName';

  const shared = validateRegistration({
    fullName: `${first} ${last}`,
    email: input.email,
    university: input.university,
    phone: input.phone,
    needsAccommodation: input.needsAccommodation,
    residence: input.residence,
    bacRegistrationNumber: input.bacRegistrationNumber,
  });
  for (const [key, value] of Object.entries(shared) as [keyof RegistrationInput, TranslationKey][]) {
    if (key !== 'fullName' && value) errors[key] = value;
  }
  return errors;
}

export function isSafeHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}
