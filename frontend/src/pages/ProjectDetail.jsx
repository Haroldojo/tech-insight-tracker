import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
    page: { maxWidth: 960, margin: "0 auto", padding: "40px 24px" },
    backLink: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 13,
        color: "var(--text-muted)",
        marginBottom: 24,
        textDecoration: "none",
        transition: "color var(--transition)",
    },
    projectHeader: {
        marginBottom: 32,
        padding: 24,
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
    },
    projectName: { fontSize: 26, fontWeight: 700, marginBottom: 8 },
    projectDesc: {
        fontSize: 14,
        color: "var(--text-secondary)",
        lineHeight: 1.6,
    },
    projectMeta: {
        display: "flex",
        gap: 16,
        marginTop: 12,
        fontSize: 12,
        color: "var(--text-muted)",
    },
    sectionHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    sectionTitle: { fontSize: 20, fontWeight: 600 },
    addBtn: {
        padding: "8px 20px",
        background: "var(--accent)",
        color: "#fff",
        border: "none",
        borderRadius: "var(--radius-sm)",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background var(--transition)",
    },
    insightCard: {
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: 20,
        marginBottom: 16,
        transition: "border-color var(--transition)",
        position: "relative",
    },
    insightTitle: { fontSize: 16, fontWeight: 600, marginBottom: 8 },
    insightContent: {
        fontSize: 14,
        color: "var(--text-secondary)",
        lineHeight: 1.6,
        marginBottom: 12,
        whiteSpace: "pre-wrap",
    },
    tagsRow: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 10,
    },
    tag: {
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.02em",
    },
    sourceLink: {
        fontSize: 12,
        color: "var(--accent)",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
    },
    insightFooter: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
        paddingTop: 10,
        borderTop: "1px solid var(--border)",
    },
    deleteInsightBtn: {
        padding: "4px 12px",
        background: "transparent",
        border: "1px solid var(--border)",
        borderRadius: 6,
        color: "var(--text-muted)",
        fontSize: 12,
        cursor: "pointer",
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
        maxWidth: 520,
        background: "var(--bg-surface)",
        borderRadius: "var(--radius)",
        padding: 32,
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
        maxHeight: "90vh",
        overflowY: "auto",
    },
    modalTitle: { fontSize: 20, fontWeight: 600, marginBottom: 24 },
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
        minHeight: 100,
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
        padding: "60px 24px",
        color: "var(--text-muted)",
        background: "var(--bg-surface)",
        borderRadius: "var(--radius)",
        border: "1px dashed var(--border)",
    },
    emptyIcon: { fontSize: 40, marginBottom: 12 },
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
    hint: {
        fontSize: 11,
        color: "var(--text-muted)",
        marginTop: 4,
    },
};

export default function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        title: "",
        content: "",
        source_url: "",
        tags: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const loadData = async () => {
        try {
            const [projRes, insRes] = await Promise.all([
                api.get(`/projects/${id}/`),
                api.get(`/projects/${id}/insights/`),
            ]);
            setProject(projRes.data);
            setInsights(insRes.data);
            setError("");
        } catch (err) {
            if (err.response?.status === 404) {
                navigate("/");
            } else {
                setError("Failed to load project.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleAddInsight = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post(`/projects/${id}/insights/`, form);
            setForm({ title: "", content: "", source_url: "", tags: "" });
            setShowModal(false);
            loadData();
        } catch {
            setError("Failed to add insight.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteInsight = async (insightId) => {
        if (!confirm("Delete this insight?")) return;
        try {
            await api.delete(`/insights/${insightId}/`);
            setInsights((prev) => prev.filter((i) => i.id !== insightId));
        } catch {
            setError("Failed to delete insight.");
        }
    };

    if (loading) {
        return (
            <div style={s.spinner}>
                <p>Loading project…</p>
            </div>
        );
    }

    if (!project) return null;

    return (
        <div style={s.page}>
            <Link
                to="/"
                style={s.backLink}
                onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--text-muted)")}
            >
                ← Back to Projects
            </Link>

            {/* Project Info */}
            <div style={s.projectHeader}>
                <h1 style={s.projectName}>{project.name}</h1>
                {project.description && (
                    <p style={s.projectDesc}>{project.description}</p>
                )}
                <div style={s.projectMeta}>
                    <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
                </div>
            </div>

            {error && <div style={s.error}>{error}</div>}

            {/* Insights Section */}
            <div style={s.sectionHeader}>
                <h2 style={s.sectionTitle}>
                    Insights ({insights.length})
                </h2>
                <button
                    id="add-insight-btn"
                    style={s.addBtn}
                    onClick={() => setShowModal(true)}
                    onMouseEnter={(e) =>
                        (e.target.style.background = "var(--accent-hover)")
                    }
                    onMouseLeave={(e) => (e.target.style.background = "var(--accent)")}
                >
                    + Add Insight
                </button>
            </div>

            {insights.length === 0 ? (
                <div style={s.empty}>
                    <div style={s.emptyIcon}>💡</div>
                    <h3 style={{ marginBottom: 8, color: "var(--text-secondary)" }}>
                        No insights yet
                    </h3>
                    <p style={{ fontSize: 14 }}>
                        Add your first insight — a note, patent, or article reference.
                    </p>
                </div>
            ) : (
                insights.map((insight) => {
                    const tags = insight.tags
                        ? insight.tags
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                        : [];

                    return (
                        <div
                            key={insight.id}
                            style={s.insightCard}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.borderColor = "var(--accent)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.borderColor = "var(--border)")
                            }
                        >
                            <h3 style={s.insightTitle}>{insight.title}</h3>
                            <div style={s.insightContent}>{insight.content}</div>

                            {tags.length > 0 && (
                                <div style={s.tagsRow}>
                                    {tags.map((tag) => {
                                        const color = tagColor(tag);
                                        return (
                                            <span
                                                key={tag}
                                                style={{
                                                    ...s.tag,
                                                    background: `${color}20`,
                                                    color: color,
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}

                            {insight.source_url && (
                                <a
                                    href={insight.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={s.sourceLink}
                                >
                                    🔗 {insight.source_url.length > 60
                                        ? insight.source_url.substring(0, 60) + "…"
                                        : insight.source_url}
                                </a>
                            )}

                            <div style={s.insightFooter}>
                                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                    {new Date(insight.created_at).toLocaleString()}
                                </span>
                                <button
                                    style={s.deleteInsightBtn}
                                    onClick={() => handleDeleteInsight(insight.id)}
                                    onMouseEnter={(e) => {
                                        e.target.style.borderColor = "var(--danger)";
                                        e.target.style.color = "var(--danger)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.borderColor = "var(--border)";
                                        e.target.style.color = "var(--text-muted)";
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })
            )}

            {/* Add Insight Modal */}
            {showModal && (
                <div style={s.overlay} onClick={() => setShowModal(false)}>
                    <form
                        style={s.modal}
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={handleAddInsight}
                    >
                        <h2 style={s.modalTitle}>Add Insight</h2>
                        <div style={s.field}>
                            <label style={s.label}>Title</label>
                            <input
                                id="insight-title-input"
                                style={s.input}
                                value={form.title}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, title: e.target.value }))
                                }
                                required
                                autoFocus
                            />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Content</label>
                            <textarea
                                id="insight-content-input"
                                style={s.textarea}
                                value={form.content}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, content: e.target.value }))
                                }
                                required
                            />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Source URL (optional)</label>
                            <input
                                id="insight-url-input"
                                style={s.input}
                                type="url"
                                value={form.source_url}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, source_url: e.target.value }))
                                }
                            />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Tags</label>
                            <input
                                id="insight-tags-input"
                                style={s.input}
                                value={form.tags}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, tags: e.target.value }))
                                }
                                placeholder="e.g. AI, machine-learning, patent"
                            />
                            <p style={s.hint}>Comma-separated</p>
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
                                id="insight-submit-btn"
                                type="submit"
                                disabled={submitting}
                                style={{
                                    ...s.submitBtn,
                                    opacity: submitting ? 0.7 : 1,
                                }}
                            >
                                {submitting ? "Adding…" : "Add Insight"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
