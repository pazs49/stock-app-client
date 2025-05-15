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

export const signup = async (email, password, personalInfo) => {
  console.log(personalInfo);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/tokens/sign_up`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      // return { ok: true, ...data };
      try {
        const response2 = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/user_info/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.token}`,
            },
            body: JSON.stringify({
              user_info: {
                first_name: personalInfo.firstName,
                last_name: personalInfo.lastName,
                address: personalInfo.address,
                birthdate: personalInfo.birthday,
              },
            }),
          }
        );

        const data2 = await response2.json();
        console.log(data2);
        return { ok: true, ...data2 };
      } catch (error) {
        const error2 = await response.json();
        console.log(error2);
        throw new Error(error.error_description.join(","));
      }
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
      `${import.meta.env.VITE_API_URL}/api/v1/user_info/get_user_info`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.error) {
      return false;
    }
    // console.log(data);
    return true;
  } else {
    return false;
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/tokens/revoke`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return { ok: true, ...data };
      } else {
        const error = await response.json();
        throw new Error(error.error_description.join(","));
      }
    }
  } catch (error) {
    return { ok: false, error };
  }
};
