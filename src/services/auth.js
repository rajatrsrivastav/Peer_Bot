export const signup = async ({ email, password }) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const { err } = await response.json();
    console.log(err);
    throw new Error(err || "Signup failed");
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
    const { err } = await response.json();
    console.log(err);
    throw new Error(err || "Login failed");
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
    const { err } = await response.json();
    console.error("Logout API error:", err);
    throw new Error(err || "Logout failed");
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
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const { err } = await response.json();
    console.log(err);
    throw new Error(err || "Failed to fetch profile");
  }

  return response;
};
