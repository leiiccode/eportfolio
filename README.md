# Portfolio

The contact form is handled by the Vercel Function in `api/contact.js`. It validates inquiries on the server and forwards them to FormSubmit without imposing a request-count or time-based limit. When Upstash Redis is configured, an identical inquiry is detected to help prevent repeated spam; duplicate detection is skipped if Redis is not configured or available so valid inquiries can still be sent.

## Deployment

The root `vercel.json` configures the Vite output and deploys `api/contact.js` as a Vercel Function. In Vercel, make sure the project's **Root Directory** is this repository, then redeploy the latest commit so `/api/contact` becomes available.

Configure these environment variables for the deployment:

- `CONTACT_EMAIL` (optional; defaults to `leiiccode@gmail.com`)
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Ensure the recipient email is activated with FormSubmit. The API reports success only when FormSubmit confirms it accepted the inquiry; email delivery still depends on FormSubmit and the recipient's mail provider.

Create a Redis database through Upstash and copy its REST URL and token into the Vercel project settings to enable duplicate detection. An identical inquiry is recognized for 24 hours. Redis is optional and its unavailability does not block inquiry delivery.

To run the Vercel Function locally, use the Vercel CLI (`vercel dev`) with the same environment variables configured.

## Local frontend development

Run `npm run dev` to start the Vite frontend. To test contact submissions locally, run the Vercel Function with `vercel dev`; duplicate detection additionally requires the optional Upstash credentials.
