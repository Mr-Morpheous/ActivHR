"use server";

import { randomInt } from "node:crypto";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getEmployeeContext } from "@/lib/supabase/employee";

async function requireSuperAdmin() {
  const identity = await getEmployeeContext();
  if (!identity || identity.role !== "super_admin") return null;
  return identity;
}

function done() {
  revalidatePath("/super/access-codes");
}

const MAX_NOTE_LENGTH = 160;
const MAX_ATTEMPTS = 5;

// Excludes 0/O and 1/I — this gets read aloud over a phone call or typed by
// hand from a sales note, and those are the pairs people mistype.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateCode(): string {
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return `ACTIVHR-${code}`;
}

/**
 * Inserts through the normal (non-service-role) client — RLS's "super admin
 * inserts" policy on org_access_codes is the actual enforcement, same
 * reasoning as every other write in src/app/super/actions.ts.
 */
export async function generateAccessCode(email: string, note?: string) {
  const identity = await requireSuperAdmin();
  if (!identity) {
    return { error: "Only platform administrators can issue an access code." };
  }

  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail || !trimmedEmail.includes("@")) {
    return { error: "Enter a valid email address." };
  }

  const trimmedNote = (note ?? "").trim().slice(0, MAX_NOTE_LENGTH) || null;

  const supabase = await createClient();

  // The unique constraint is the real backstop; retrying on a collision
  // (astronomically unlikely at this alphabet/length, but free to handle)
  // is cheaper than thinking harder about it.
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const code = generateCode();
    const { error } = await supabase.from("org_access_codes").insert({
      code,
      email: trimmedEmail,
      note: trimmedNote,
      created_by: identity.id,
    });

    if (!error) {
      done();
      return { success: true as const, code };
    }

    if (error.code !== "23505") {
      return { error: error.message };
    }
  }

  return { error: "Couldn't generate a unique code. Try again." };
}

export async function revokeAccessCode(id: string) {
  if (!(await requireSuperAdmin())) {
    return { error: "Only platform administrators can revoke an access code." };
  }

  const supabase = await createClient();
  const { error, count } = await supabase
    .from("org_access_codes")
    .update({ status: "revoked", revoked_at: new Date().toISOString() }, { count: "exact" })
    .eq("id", id)
    .eq("status", "pending");

  if (error) return { error: error.message };
  if (!count) {
    return { error: "That code is no longer pending — it may already be used or revoked." };
  }

  done();
  return { success: true as const };
}
