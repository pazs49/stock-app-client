export const fetchStocks = async (stock) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/stocks/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          symbol: stock,
        }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      return { ok: true, data };
    } else {
      const error = await response.json();
      throw new Error(error.error.join(","));
    }
  } catch (error) {
    return { ok: false, error };
  }
};
