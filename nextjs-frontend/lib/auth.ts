import type { AuthResponse, LoginFormData, RegisterFormData, User } from "@/types";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export const AUTH_COOKIE = "viettour_jwt";

export async function strapiLogin(
  data: LoginFormData
): Promise<AuthResponse> {
  const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: data.email,
      password: data.password,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error?.message || "Email hoặc mật khẩu không đúng"
    );
  }

  return result;
}

export async function strapiUpdateUser(
  userId: number,
  jwt: string,
  data: {
    fullName?: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
    province?: string;
    district?: string;
    ward?: string;
    addressDetail?: string;
  }
): Promise<User | null> {
  const response = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) return null;
  return response.json();
}

export async function strapiRegister(
  data: RegisterFormData
): Promise<AuthResponse> {
  const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: data.username,
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      phone: data.phone,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error?.message || "Không thể đăng ký tài khoản"
    );
  }

  return result;
}

export async function strapiGetMe(jwt: string): Promise<User> {
  const response = await fetch(`${STRAPI_URL}/api/users/me-with-role`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });

  if (!response.ok) {
    throw new Error("Phiên đăng nhập không hợp lệ");
  }

  return response.json();
}
