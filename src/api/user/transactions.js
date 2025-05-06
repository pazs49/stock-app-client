export const fetchUserTransactions = async (role = "user") => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/user_info/${
        role === "user"
          ? "get_user_transactions"
          : "get_user_transactions_admin"
      }`,
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
      return { ok: true, data };
    } else {
      const error = await response.json();
      throw new Error(error.error.join(","));
    }
  } catch (error) {
    return { ok: false, error };
  }
};
