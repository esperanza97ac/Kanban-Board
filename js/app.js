import { api } from "./api.js";
import { USERS } from "./config.js";
import * as ui from "./ui.js";

const state = {
  tasks: [],
  filters: { search: "", priority: "", person: "", date: "" },
  activeTaskId: null,
};

const $ = (sel) => document.querySelector(sel);

/* Cargar tareas iniciales */
async function loadTasks() {
  try {
    state.tasks = await api.getTasks();
    ui.renderBoard(state.tasks, state.filters);
  } catch (err) {
    ui.showToast("Error al conectar con el servidor json-server");
  }
}

/* Drag & Drop con PATCH */
function initSortable() {
  document.querySelectorAll(".column__list").forEach((list) => {
    Sortable.create(list, {
      group: "tasks",
      animation: 150,
      draggable: ".card",
      onEnd: async (e) => {
        const id = e.item.dataset.id;
        const newStatus = e.to.dataset.status;
        const task = state.tasks.find((t) => String(t.id) === String(id));

        if (task && task.status !== newStatus) {
          task.status = newStatus;
          ui.renderBoard(state.tasks, state.filters);
          try {
            await api.patchTask(id, { status: newStatus });
            ui.showToast("Estado actualizado");
          } catch {
            ui.showToast("Error al actualizar estado");
          }
        }
      },
    });
  });
}

/* Crear Tarea (POST) */
async function handleCreate(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);

  const newTask = {
    title:       data.get("title").trim(),
    description: data.get("description").trim(),
    priority:    data.get("priority"),
    dueDate:     data.get("dueDate") || "",
    assignee:    data.get("assignee") || "",
    status:      "todo", // por defecto a Por Hacer
  };

  try {
    const created = await api.createTask(newTask);
    state.tasks.push(created);
    ui.renderBoard(state.tasks, state.filters);
    form.reset();
    ui.closeModal("#modal-create");
    ui.showToast("Tarea creada");
  } catch {
    ui.showToast("Error al crear tarea");
  }
}

/* Abrir Detalle / Edición */
async function openDetail(id) {
  const task = state.tasks.find((t) => String(t.id) === String(id));
  if (!task) return;

  state.activeTaskId = task.id;
  const form = $("#form-detail");

  form.elements.title.value       = task.title ?? "";
  form.elements.description.value = task.description ?? "";
  form.elements.priority.value    = task.priority ?? "Media";
  form.elements.dueDate.value     = task.dueDate ?? "";
  form.elements.assignee.value    = task.assignee ?? "";

  ui.openModal("#modal-detail");

  try {
    ui.renderComments(await api.getComments(task.id));
  } catch {
    ui.renderComments([]);
  }
}

/* Guardar Cambios (PUT) */
async function handleDetailSave(e) {
  e.preventDefault();
  const form = e.target;
  const task = state.tasks.find((t) => String(t.id) === String(state.activeTaskId));
  if (!task) return;

  const updated = {
    ...task,
    title:       form.elements.title.value.trim(),
    description: form.elements.description.value.trim(),
    priority:    form.elements.priority.value,
    dueDate:     form.elements.dueDate.value || "",
    assignee:    form.elements.assignee.value,
  };

  try {
    const saved = await api.putTask(task.id, updated);
    Object.assign(task, saved ?? updated);
    ui.renderBoard(state.tasks, state.filters);
    ui.closeModal("#modal-detail");
    ui.showToast("Tarea actualizada");
  } catch {
    ui.showToast("Error al guardar");
  }
}

/* Eliminar Tarea (DELETE) */
async function deleteTask(id) {
  if (!confirm("¿Eliminar esta tarea?")) return;
  try {
    await api.deleteTask(id);
    state.tasks = state.tasks.filter((t) => String(t.id) !== String(id));
    ui.renderBoard(state.tasks, state.filters);
    ui.closeModal("#modal-detail");
    ui.showToast("Tarea eliminada");
  } catch {
    ui.showToast("Error al eliminar");
  }
}

/* Añadir Comentario (POST) */
async function handleComment(e) {
  e.preventDefault();
  const form = e.target;
  const author = form.elements.author.value.trim();
  const text = form.elements.text.value.trim();

  try {
    await api.createComment({
      taskId: String(state.activeTaskId),
      author,
      text,
      createdAt: new Date().toISOString(),
    });
    form.elements.text.value = "";
    ui.renderComments(await api.getComments(state.activeTaskId));
    ui.showToast("Comentario añadido");
  } catch {
    ui.showToast("Error al añadir comentario");
  }
}

/* Menú Hamburguesa y Filtros en Tiempo Real */
function initHamburgerAndFilters() {
  const btn = $("#hamburger-btn");
  const menu = $("#hamburger-menu");

  // Abrir / Cerrar Menú Hamburguesa
  btn.addEventListener("click", () => {
    menu.classList.toggle("is-open");
  });

  // Búsqueda en tiempo real por título
  $("#filter-search").addEventListener("input", (e) => {
    state.filters.search = e.target.value;
    ui.renderBoard(state.tasks, state.filters);
  });

  // Filtro por prioridad
  $("#filter-priority").addEventListener("change", (e) => {
    state.filters.priority = e.target.value;
    ui.renderBoard(state.tasks, state.filters);
  });

  // Filtro por persona
  $("#filter-person").addEventListener("change", (e) => {
    state.filters.person = e.target.value;
    ui.renderBoard(state.tasks, state.filters);
  });

  // Filtro por fecha
  $("#filter-date").addEventListener("change", (e) => {
    state.filters.date = e.target.value;
    ui.renderBoard(state.tasks, state.filters);
  });

  // Botón limpiar filtros
  $("#btn-clear-filters").addEventListener("click", () => {
    state.filters = { search: "", priority: "", person: "", date: "" };
    $("#filter-search").value = "";
    $("#filter-priority").value = "";
    $("#filter-person").value = "";
    $("#filter-date").value = "";
    ui.renderBoard(state.tasks, state.filters);
  });
}

/* Delegación de Modales y Eventos */
function initEvents() {
  $("#form-create").addEventListener("submit", handleCreate);
  $("#form-detail").addEventListener("submit", handleDetailSave);
  $("#form-comment").addEventListener("submit", handleComment);
  $("#btn-delete").addEventListener("click", () => deleteTask(state.activeTaskId));
  $("#btn-new").addEventListener("click", () => ui.openModal("#modal-create"));

  // Cerrar Modales
  document.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-close")) {
      ui.closeModal("#modal-create");
      ui.closeModal("#modal-detail");
    }
  });

  // Abrir detalle o eliminar desde tarjeta
  $("#board").addEventListener("click", (e) => {
    const delBtn = e.target.closest('[data-action="delete"]');
    if (delBtn) {
      e.stopPropagation();
      deleteTask(delBtn.closest(".card").dataset.id);
      return;
    }

    const card = e.target.closest(".card");
    if (card) openDetail(card.dataset.id);
  });
}

/* Inicialización */
function init() {
  ui.populateAssigneeSelects(USERS);
  initHamburgerAndFilters();
  initEvents();
  initSortable();
  loadTasks();
}

document.addEventListener("DOMContentLoaded", init);