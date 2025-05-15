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

export const fetchUserStocks = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/stocks`,
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
      throw new Error(error.error.join(","));
    }
  } catch (error) {
    return { ok: false, error };
  }
};

export const buyStock = async (qty, stockName) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/stocks/buy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          stock_qty: qty,
          symbol: stockName,
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

export const sellStock = async (qty, stockName) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/stocks/sell`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          stock_qty: qty,
          symbol: stockName,
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

export const updateStock = async (symbol) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/stocks/update_stock_price`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          symbol: symbol,
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
