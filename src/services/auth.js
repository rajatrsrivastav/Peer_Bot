const extractErrorMessage = async (response) => {
  try {
    const text = await response.text();
    if (!text) return null;

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      parsed = text;
    }

    if (typeof parsed === "string") {
      try {
        parsed = JSON.parse(parsed);
      } catch (e) {
        // leave as string
      }
    }

    if (parsed && typeof parsed === "object") {
      return parsed.message || parsed.err || parsed.error || (parsed.details && parsed.details[0] && parsed.details[0].message) || null;
    }

    if (typeof parsed === "string") return parsed;
    return null;
  } catch (e) {
    return null;
  }
};

export const signup = async ({ email, password }) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const message = (await extractErrorMessage(response)) || "Signup failed";
    throw new Error(message);
  }

  return response;
};

export const login = async ({ email, password }) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const message = (await extractErrorMessage(response)) || "Login failed";
    throw new Error(message);
  }

  return response;
};

export const logout = async ({ token }) => {
  if (!token) {
    throw new Error("Token is required for logout");
  }

  const response = await fetch("/api/auth/logout", {
    method: "POST",
    body: JSON.stringify({ token }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const message = (await extractErrorMessage(response)) || "Logout failed";
    throw new Error(message);
  }

  return response;
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch("/api/auth/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const message = (await extractErrorMessage(response)) || "Failed to fetch profile";
    throw new Error(message);
  }

  return response;
};
