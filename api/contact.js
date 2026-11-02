import { createHash } from 'node:crypto';
import { Redis } from '@upstash/redis';

const MAX_NAME_LENGTH = 80;
const MAX_CONTACT_LENGTH = 255;
const MAX_DETAILS_LENGTH = 1500;
const DUPLICATE_TTL_SECONDS = 24 * 60 * 60;
const DEFAULT_CONTACT_EMAIL = 'leiiccode@gmail.com';

let redis;

const getRedis = () => {
  if (redis) {
    return redis;
  }

  const env = globalThis.process?.env ?? {};
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  redis = new Redis({ url, token });
  return redis;
};

const getFormSubmitEndpoint = () => {
  const env = globalThis.process?.env ?? {};
  const recipient = env.CONTACT_EMAIL || DEFAULT_CONTACT_EMAIL;
  return `https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`;
};

const sanitizeField = (value, maxLength) => {
  if (typeof value !== 'string') {
    return '';
  }

  let withoutControlCharacters = '';
  for (const character of value.replace(/<[^>]*>/g, '')) {
    const code = character.charCodeAt(0);
    if ((code >= 0 && code <= 31) || code === 127) {
      continue;
    }
    withoutControlCharacters += character;
  }

  return withoutControlCharacters.trim().slice(0, maxLength);
};

const validatePayload = (body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Please provide valid contact form information.' };
  }

  if (
    typeof body.name !== 'string' ||
    body.name.length > MAX_NAME_LENGTH ||
    typeof body.contact !== 'string' ||
    body.contact.length > MAX_CONTACT_LENGTH ||
    typeof body.details !== 'string' ||
    body.details.length > MAX_DETAILS_LENGTH
  ) {
    return { error: 'One or more fields are too long or invalid.' };
  }

  const name = sanitizeField(body.name, MAX_NAME_LENGTH);
  const contact = sanitizeField(body.contact, MAX_CONTACT_LENGTH);
  const details = sanitizeField(body.details, MAX_DETAILS_LENGTH);

  if (!/^[\p{L}\p{N} .,'’-]{2,80}$/u.test(name)) {
    return { error: 'Please enter a valid name.' };
  }

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const validFacebookContact =
    /^(https?:\/\/)?(www\.)?facebook\.com\//i.test(contact) ||
    /^@?[a-z0-9._-]{2,50}$/i.test(contact);

  if (!validEmail && !validFacebookContact) {
    return { error: 'Use a valid email or Facebook profile link.' };
  }

  if (details.length < 10 || /(?:<\s*script|javascript:|on\w+\s*=)/i.test(details)) {
    return { error: 'Please provide valid project details.' };
  }

  return { value: { name, contact, details } };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!req.headers['content-type']?.includes('application/json')) {
    return res.status(415).json({ error: 'Content-Type must be application/json.' });
  }

  const validation = validatePayload(req.body);
  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }
  const payload = validation.value;

  const duplicateKey = `portfolio:contact:duplicate:${createHash('sha256')
    .update(`${payload.name.toLowerCase()}|${payload.contact.toLowerCase()}|${payload.details.toLowerCase()}`)
    .digest('hex')}`;
  let duplicateStore;
  let duplicateReserved = false;
  try {
    duplicateStore = getRedis();
    if (duplicateStore) {
      const reservation = await duplicateStore.set(duplicateKey, '1', {
        nx: true,
        ex: DUPLICATE_TTL_SECONDS,
      });
      if (reservation !== 'OK') {
        return res.status(409).json({ error: 'Mukhang naipadala na ang parehong inquiry. Kung may iba ka pang detalye, baguhin ang mensahe at subukan muli.' });
      }
      duplicateReserved = true;
    }
  } catch (error) {
    console.error('Contact duplicate check error; continuing without duplicate detection:', error);
  }

  const releaseDuplicateReservation = async () => {
    if (!duplicateReserved) {
      return;
    }

    try {
      await duplicateStore.del(duplicateKey);
    } catch (error) {
      console.error('Could not release contact duplicate reservation:', error);
    }
  };

  try {
    const response = await fetch(getFormSubmitEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        ...payload,
        _subject: `New Inquiry from ${payload.name}`,
        _template: 'table',
      }),
    });

    let result;
    try {
      result = await response.json();
    } catch (error) {
      console.error('FormSubmit returned an invalid response:', error);
      await releaseDuplicateReservation();
      return res.status(502).json({ error: 'Hindi makumpirma ng email service ang pagpapadala. Pakisubukan muli mamaya.' });
    }

    if (!response.ok || (result?.success !== true && result?.success !== 'true')) {
      console.error('FormSubmit did not accept the inquiry:', response.status, result?.message);
      await releaseDuplicateReservation();
      return res.status(502).json({
        error: 'Hindi tinanggap ng email service ang inquiry. Tiyaking na-activate ang FormSubmit para sa recipient email.',
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('FormSubmit request error:', error);
    await releaseDuplicateReservation();
    return res.status(502).json({ error: 'Inquiry could not be delivered.' });
  }
}
