export const checkToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const res = await fetch("http://localhost:5000/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.status === 200;
  } catch (err) {
    return false;
  }
};
