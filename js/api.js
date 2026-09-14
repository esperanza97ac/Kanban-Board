import { API_URL, ENDPOINTS } from "./config.js";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) throw new Error(`Error ${res.status}`);
  if (res.status === 204) return null;

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  getTasks:   ()          => request(ENDPOINTS.tasks),
  createTask: (task)      => request(ENDPOINTS.tasks,       { method: "POST",   body: JSON.stringify(task) }),
  patchTask:  (id, patch) => request(`${ENDPOINTS.tasks}/${id}`, { method: "PATCH",  body: JSON.stringify(patch) }),
  putTask:    (id, task)  => request(`${ENDPOINTS.tasks}/${id}`, { method: "PUT",    body: JSON.stringify(task) }),
  deleteTask: (id)        => request(`${ENDPOINTS.tasks}/${id}`, { method: "DELETE" }),

  getComments:   (taskId)  => request(`${ENDPOINTS.comments}?taskId=${taskId}`),
  createComment: (comment) => request(ENDPOINTS.comments, { method: "POST", body: JSON.stringify(comment) }),
};