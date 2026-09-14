import { STATUS } from "./config.js";

export const escapeHtml = (val = "") =>
  String(val).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
}

/* Crear tarjeta HTML */
export function createCard(task) {
  const el = document.createElement("article");
  el.className = "card";
  el.dataset.id = task.id;

  const due = formatDate(task.dueDate);

  el.innerHTML = `
    <div class="card__top">
      <span class="badge badge--${(task.priority || "media").toLowerCase()}">${escapeHtml(task.priority)}</span>
      <button class="icon-btn" data-action="delete" title="Eliminar">✕</button>
    </div>
    <h3 class="card__title">${escapeHtml(task.title)}</h3>
    ${task.description ? `<p class="card__desc">${escapeHtml(task.description)}</p>` : ""}
    <footer class="card__foot">
      <span>👤 ${escapeHtml(task.assignee || "Sin asignar")}</span>
      ${due ? `<span>🗓 ${escapeHtml(due)}</span>` : ""}
    </footer>
  `;
  return el;
}

/* Renderizado del tablero filtrado */
export function renderBoard(tasks, filters = {}) {
  const searchStr = (filters.search || "").toLowerCase().trim();

  // Filtrado de tareas según búsqueda, prioridad, persona y fecha
  const visible = tasks.filter((t) => {
    const matchSearch = !searchStr || t.title.toLowerCase().includes(searchStr);
    const matchPriority = !filters.priority || t.priority === filters.priority;
    const matchPerson = !filters.person || t.assignee === filters.person;
    const matchDate = !filters.date || t.dueDate === filters.date;

    return matchSearch && matchPriority && matchPerson && matchDate;
  });

  const counts = { todo: 0, doing: 0, done: 0 };

  Object.keys(STATUS).forEach((status) => {
    const list = document.querySelector(`.column__list[data-status="${status}"]`);
    if (!list) return;

    list.innerHTML = "";
    const items = visible.filter((t) => t.status === status);
    counts[status] = items.length;

    if (items.length === 0) {
      list.innerHTML = `<p class="empty-state">Sin tareas</p>`;
    } else {
      items.forEach((t) => list.appendChild(createCard(t)));
    }

    // Actualizar contadores por columna
    const countEl = document.querySelector(`[data-count="${status}"]`);
    if (countEl) countEl.textContent = items.length;
  });

  // Estadísticas rápidas globales
  document.querySelector("#stat-todo").textContent = counts.todo;
  document.querySelector("#stat-doing").textContent = counts.doing;
  document.querySelector("#stat-done").textContent = counts.done;
}

/* Renderizado de Comentarios */
export function renderComments(comments = []) {
  const list = document.querySelector("#comment-list");
  if (!list) return;

  if (comments.length === 0) {
    list.innerHTML = `<li class="comment comment--empty">Sin comentarios</li>`;
    return;
  }

  list.innerHTML = comments.map((c) => `
    <li class="comment">
      <div class="comment__body">
        <strong>${escapeHtml(c.author)}</strong>
        <p>${escapeHtml(c.text)}</p>
      </div>
    </li>
  `).join("");
}

/* Modales y Toast */
export function openModal(sel) {
  const m = document.querySelector(sel);
  if (m) m.classList.add("is-open");
}

export function closeModal(sel) {
  const m = document.querySelector(sel);
  if (m) m.classList.remove("is-open");
}

export function showToast(msg) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("is-visible");
  setTimeout(() => toast.classList.remove("is-visible"), 2500);
}

export function populateAssigneeSelects(users = []) {
  const options = users.map((u) => `<option value="${escapeHtml(u)}">${escapeHtml(u)}</option>`).join("");
  ["#create-assignee", "#detail-assignee"].forEach((sel) => {
    const el = document.querySelector(sel);
    if (el) el.innerHTML = options;
  });
  const filter = document.querySelector("#filter-person");
  if (filter) filter.innerHTML = `<option value="">Todas</option>${options}`;
}