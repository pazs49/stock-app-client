export const login = async (email, password) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/tokens/sign_in`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      return { ok: true, ...data };
    } else {
      const error = await response.json();
      throw new Error(error.error_description.join(","));
    }
  } catch (error) {
    return { ok: false, error };
  }
};

export const signup = async (email, password) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/tokens/sign_up`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return { ok: true, ...data };
    } else {
      const error = await response.json();
      throw new Error(error.error_description.join(","));
    }
  } catch (error) {
    return { ok: false, error };
  }
};

export const checkToken = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/tokens/info`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return true;
  } else {
    return false;
  }
};
