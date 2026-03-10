// src/service/passwordResetAPI.js

const MOCK_CODE = "123456";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendResetCode(identifier) {
  await wait(800);

  const trimmed = identifier?.trim();

  if (!trimmed) {
    throw new Error("Please enter your username or email.");
  }

  // mock: Simulates "user does not exist"
  if (
    trimmed.toLowerCase() === "notfound" ||
    trimmed.toLowerCase() === "notfound@example.com"
  ) {
    throw new Error("User not found.");
  }

  return {
    success: true,
    message: "Mock verification code sent.",
    mockCode: MOCK_CODE, // Facilitate testing during development
    expiresIn: 300,
  };
}

export async function verifyResetCode(identifier, code) {
  await wait(800);

  const trimmedIdentifier = identifier?.trim();
  const trimmedCode = code?.trim();

  if (!trimmedIdentifier) {
    throw new Error("Missing identifier.");
  }

  if (!trimmedCode) {
    throw new Error("Please enter the verification code.");
  }

  if (!/^\d{6}$/.test(trimmedCode)) {
    throw new Error("Please enter a valid 6-digit code.");
  }

  if (trimmedCode !== MOCK_CODE) {
    throw new Error("Invalid verification code.");
  }

  return {
    success: true,
    message: "Code verified successfully.",
  };
}

export async function resetPasswordWithCode(
  identifier,
  code,
  password,
  passwordConfirmation
) {
  await wait(1000);

  const trimmedIdentifier = identifier?.trim();
  const trimmedCode = code?.trim();

  if (!trimmedIdentifier) {
    throw new Error("Missing identifier.");
  }

  if (trimmedCode !== MOCK_CODE) {
    throw new Error("Verification code is invalid.");
  }

  if (!password || password.length < 6) {
    throw new Error("New password must be at least 6 characters.");
  }

  if (password !== passwordConfirmation) {
    throw new Error("The two passwords do not match.");
  }

  return {
    success: true,
    message: "Password reset successful.",
  };
}