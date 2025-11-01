async function loadData(url, key) {
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached);

  const res = await fetch(url);
  const data = await res.json();

  localStorage.setItem(key, JSON.stringify(data));
  return data;
}


export { loadData };