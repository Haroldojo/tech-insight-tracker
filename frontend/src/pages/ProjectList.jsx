import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const TAG_COLORS = [
    "#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6",
    "#ec4899", "#06b6d4", "#f97316", "#14b8a6", "#e11d48",
];

function tagColor(tag) {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

const s = {
    page: {
        maxWidth: 960,
        margin: "0 auto",
        padding: "40px 24px",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 32,
    },
    h1: { fontSize: 28, fontWeight: 700 },
    count: {
        fontSize: 14,
        color: "var(--text-muted)",
        marginTop: 4,
    },
    addBtn: {
        padding: "10px 24px",
        background: "var(--accent)",
        color: "#fff",
        border: "none",
        borderRadius: "var(--radius-sm)",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background var(--transition)",
        display: "flex",
        alignItems: "center",
        gap: 8,
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 20,
    },
    card: {
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: 24,
        transition: "all var(--transition)",
        cursor: "pointer",
        position: "relative",
    },
    cardName: {
        fontSize: 17,
        fontWeight: 600,
        marginBottom: 8,
        color: "var(--text-primary)",
    },
    cardDesc: {
        fontSize: 13,
        color: "var(--text-secondary)",
        marginBottom: 16,
        lineHeight: 1.5,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
    },
    cardMeta: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 12,
        color: "var(--text-muted)",
    },
    badge: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: "var(--accent-dim)",
        color: "var(--accent)",
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 500,
    },
    deleteBtn: {
        position: "absolute",
        top: 12,
        right: 12,
        width: 28,
        height: 28,
        borderRadius: 6,
        background: "transparent",
        border: "1px solid transparent",
        color: "var(--text-muted)",
        fontSize: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        opacity: 0,
        transition: "all var(--transition)",
    },
    // modal
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
    },
    modal: {
        width: "100%",
        maxWidth: 480,
        background: "var(--bg-surface)",
        borderRadius: "var(--radius)",
        padding: 32,
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 600,
        marginBottom: 24,
    },
    field: { marginBottom: 20 },
    label: {
        display: "block",
        fontSize: 13,
        fontWeight: 500,
        color: "var(--text-secondary)",
        marginBottom: 6,
    },
    input: {
        width: "100%",
        padding: "10px 14px",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        fontSize: 14,
    },
    textarea: {
        width: "100%",
        padding: "10px 14px",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        fontSize: 14,
        resize: "vertical",
        minHeight: 80,
    },
    modalActions: {
        display: "flex",
        gap: 12,
        justifyContent: "flex-end",
        marginTop: 8,
    },
    cancelBtn: {
        padding: "10px 20px",
        background: "transparent",
        color: "var(--text-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
    },
    submitBtn: {
        padding: "10px 24px",
        background: "var(--accent)",
        color: "#fff",
        border: "none",
        borderRadius: "var(--radius-sm)",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
    },
    empty: {
        textAlign: "center",
        padding: "80px 24px",
        color: "var(--text-muted)",
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    error: {
        background: "rgba(239,68,68,0.1)",
        border: "1px solid var(--danger)",
        color: "var(--danger)",
        padding: "10px 14px",
        borderRadius: "var(--radius-sm)",
        fontSize: 13,
        marginBottom: 20,
    },
    spinner: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        color: "var(--text-secondary)",
    },
};

export default function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: "", description: "" });
    const [submitting, setSubmitting] = useState(false);

    const loadProjects = async () => {
        try {
            const { data } = await api.get("/projects/");
            setProjects(data);
            setError("");
        } catch {
            setError("Failed to load projects.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post("/projects/", form);
            setForm({ name: "", description: "" });
            setShowModal(false);
            loadProjects();
        } catch {
            setError("Failed to create project.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm("Delete this project and all its insights?")) return;
        try {
            await api.delete(`/projects/${id}/`);
            setProjects((prev) => prev.filter((p) => p.id !== id));
        } catch {
            setError("Failed to delete project.");
        }
    };

    if (loading) {
        return (
            <div style={s.spinner}>
                <p>Loading projects…</p>
            </div>
        );
    }

    return (
        <div style={s.page}>
            <div style={s.header}>
                <div>
                    <h1 style={s.h1}>Projects</h1>
                    <p style={s.count}>
                        {projects.length} project{projects.length !== 1 && "s"}
                    </p>
                </div>
                <button
                    id="create-project-btn"
                    style={s.addBtn}
                    onClick={() => setShowModal(true)}
                    onMouseEnter={(e) =>
                        (e.target.style.background = "var(--accent-hover)")
                    }
                    onMouseLeave={(e) => (e.target.style.background = "var(--accent)")}
                >
                    + New Project
                </button>
            </div>

            {error && <div style={s.error}>{error}</div>}

            {projects.length === 0 ? (
                <div style={s.empty}>
                    <div style={s.emptyIcon}>📁</div>
                    <h3 style={{ marginBottom: 8, color: "var(--text-secondary)" }}>
                        No projects yet
                    </h3>
                    <p style={{ fontSize: 14 }}>
                        Create your first project to start tracking insights.
                    </p>
                </div>
            ) : (
                <div style={s.grid}>
                    {projects.map((p) => (
                        <Link
                            key={p.id}
                            to={`/projects/${p.id}`}
                            style={{ textDecoration: "none" }}
                        >
                            <div
                                style={s.card}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "var(--accent)";
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow =
                                        "0 8px 32px rgba(99,102,241,0.15)";
                                    const del = e.currentTarget.querySelector(".del-btn");
                                    if (del) del.style.opacity = "1";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--border)";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                    const del = e.currentTarget.querySelector(".del-btn");
                                    if (del) del.style.opacity = "0";
                                }}
                            >
                                <button
                                    className="del-btn"
                                    style={s.deleteBtn}
                                    title="Delete project"
                                    onClick={(e) => handleDelete(p.id, e)}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = "rgba(239,68,68,0.1)";
                                        e.target.style.borderColor = "var(--danger)";
                                        e.target.style.color = "var(--danger)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = "transparent";
                                        e.target.style.borderColor = "transparent";
                                        e.target.style.color = "var(--text-muted)";
                                    }}
                                >
                                    ✕
                                </button>
                                <div style={s.cardName}>{p.name}</div>
                                <div style={s.cardDesc}>
                                    {p.description || "No description"}
                                </div>
                                <div style={s.cardMeta}>
                                    <span style={s.badge}>
                                        📝 {p.insights_count} insight
                                        {p.insights_count !== 1 && "s"}
                                    </span>
                                    <span>
                                        {new Date(p.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Create Project Modal */}
            {showModal && (
                <div style={s.overlay} onClick={() => setShowModal(false)}>
                    <form
                        style={s.modal}
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={handleCreate}
                    >
                        <h2 style={s.modalTitle}>New Project</h2>
                        <div style={s.field}>
                            <label style={s.label}>Project Name</label>
                            <input
                                id="project-name-input"
                                style={s.input}
                                value={form.name}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, name: e.target.value }))
                                }
                                required
                                autoFocus
                            />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Description</label>
                            <textarea
                                id="project-desc-input"
                                style={s.textarea}
                                value={form.description}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, description: e.target.value }))
                                }
                            />
                        </div>
                        <div style={s.modalActions}>
                            <button
                                type="button"
                                style={s.cancelBtn}
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                id="project-submit-btn"
                                type="submit"
                                disabled={submitting}
                                style={{
                                    ...s.submitBtn,
                                    opacity: submitting ? 0.7 : 1,
                                }}
                            >
                                {submitting ? "Creating…" : "Create Project"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
