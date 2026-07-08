"use server";

// TODO(orchestrator): wire this to a real transport (email/CRM/Sanity doc).
// the original site used reCAPTCHA + a form endpoint we are not replicating.
// for now this validates presence and returns a success/error result only:
// nothing is persisted or emailed, so the success copy says so honestly.
export type ContactState = {
  ok: boolean;
  message: string;
} | null;

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, message: "Please fill in your name, email and message." };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  // no backend wired yet: be honest that this demo form sends nothing.
  return {
    ok: true,
    message:
      "Thanks! This is a demo form, so nothing was sent. Please reach us directly using the contact details above.",
  };
}
