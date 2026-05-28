import crypto from "crypto";
import prisma from "../db/client.js";

// Generates a cryptographically secure review token and stores it in the DB.
// Called from the tokens route when the guide clicks "Generate Review Link".
export const generateReviewToken = async (
  userId: string,
  customerName?: string,
  expiryDays: number = 7, // Token expires in 7 days by default
): Promise<{ token: string; expiresAt: Date }> => {
  // Generate 32 random bytes → 64 character hex string
  // This is the actual secret that goes in the URL
  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiryDays);

  // Store it in the database
  await prisma.reviewToken.create({
    data: {
      userId,
      token,
      customerName,
      expiresAt,
    },
  });

  return { token, expiresAt };
};

// Verifies a token is valid, not expired, and not already used.
// Called when a customer visits /review/[token]
export const verifyReviewToken = async (token: string) => {
  const reviewToken = await prisma.reviewToken.findUnique({
    where: { token },
  });

  if (!reviewToken) {
    return { valid: false, reason: "Token not found" };
  }

  if (reviewToken.usedAt) {
    return { valid: false, reason: "This review link has already been used" };
  }

  if (new Date() > reviewToken.expiresAt) {
    return { valid: false, reason: "This review link has expired" };
  }

  return { valid: true, reviewToken };
};
