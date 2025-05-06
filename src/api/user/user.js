export const fetchUserInfo = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/user_info/get_user_info`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
  } catch (error) {
    return { ok: false, error };
  }
};

export const fetchAllUsers = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/users`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      // console.log(data);
      return { ok: true, data };
    } else {
      const error = await response.json();
      throw new Error(error.error_description.join(","));
    }
  } catch (error) {
    return { ok: false, error };
  }
};

export const adminCreateUser = async (email, password, cb) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/admin/create_user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          user: {
            email,
            password,
          },
        }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      cb();
      return { ok: true, ...data };
    } else {
      const error = await response.json();
      throw new Error(error.error.join(","));
    }
  } catch (error) {
    return { ok: false, error };
  }
};

export const adminUpdateUserBalance = async (userId, balance) => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/v1/user_info/edit_user_info_admin/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          user_info: {
            balance,
          },
        }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return { ok: true, data };
    } else {
      const error = await response.json();
      throw new Error(error.error.join(","));
    }
  } catch (error) {
    return { ok: false, error };
  }
};

export const fetchUserByAdmin = async (userId) => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/v1/user_info/get_user_info_admin/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return { ok: true, ...data };
    } else {
      const error = await response.json();
      throw new Error(error.error_description.join(","));
    }
  } catch (error) {
    return { ok: false, error };
  }
};

export const adminApproveUser = async (userId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/admin/approve_user/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          user: {
            id: userId,
          },
        }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      return { ok: true, ...data };
    } else {
      const error = await response.json();
      throw new Error(error.error.join(","));
    }
  } catch (error) {
    return { ok: false, error };
  }
};
