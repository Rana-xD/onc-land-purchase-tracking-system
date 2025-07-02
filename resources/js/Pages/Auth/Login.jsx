import React from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="ចូលប្រើប្រាស់" />

            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "0.375rem",
                    boxShadow:
                        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                    overflow: "hidden",
                }}
            >
                {/* Header with Logo */}
                <div
                    style={{
                        textAlign: "center",
                        paddingTop: "32px",
                        paddingBottom: "16px",
                    }}
                >
                    <div style={{ marginBottom: "8px" }}>
                        <svg
                            style={{
                                width: "28px",
                                height: "28px",
                                margin: "0 auto",
                                color: "black",
                            }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <h2
                        style={{
                            color: "#111827",
                            fontWeight: "bold",
                            fontSize: "18px",
                            letterSpacing: "0.05em",
                            marginBottom: "4px",
                        }}
                    >
                        CAMBODIA
                    </h2>
                    <p
                        style={{
                            color: "#4B5563",
                            fontSize: "16px",
                            letterSpacing: "0.05em",
                        }}
                    >
                        LAND TRACKER
                    </p>
                </div>

                <div style={{ padding: "0 32px 24px" }}>
                    <h3
                        style={{
                            textAlign: "center",
                            color: "#1F2937",
                            fontSize: "20px",
                            fontWeight: "500",
                            marginBottom: "24px",
                        }}
                    >
                        សូមស្វាគមន៍
                    </h3>

                    <form onSubmit={submit}>
                        {/* Username Field */}
                        <div style={{ marginBottom: "20px" }}>
                            <label
                                style={{
                                    display: "block",
                                    color: "#374151",
                                    marginBottom: "8px",
                                    fontSize: "16px",
                                }}
                            >
                                ឈ្មោះអ្នកប្រើប្រាស់
                            </label>
                            <div style={{ position: "relative" }}>
                                <div
                                    style={{
                                        position: "absolute",
                                        left: "16px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#9CA3AF",
                                    }}
                                >
                                    <svg
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                        }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់"
                                    value={data.username}
                                    onChange={(e) =>
                                        setData("username", e.target.value)
                                    }
                                    style={{
                                        width: "100%",
                                        paddingLeft: "40px",
                                        paddingRight: "16px",
                                        paddingTop: "12px",
                                        paddingBottom: "12px",
                                        border: "1px solid #D1D5DB",
                                        borderRadius: "0.375rem",
                                        fontSize: "16px",
                                        outline: "none",
                                    }}
                                    autoComplete="username"
                                    autoFocus
                                />
                            </div>
                            {errors.username && (
                                <div
                                    style={{
                                        color: "#EF4444",
                                        fontSize: "14px",
                                        marginTop: "8px",
                                    }}
                                >
                                    {errors.username ===
                                    "These credentials do not match our records." ? 
                                        "ព័ត៌មានទាំងនេះមិនត្រឹមត្រូវទេ។" : 
                                        errors.username
                                    }
                                </div>
                            )}
                        </div>

                        {/* Password Field */}
                        <div style={{ marginBottom: "20px" }}>
                            <label
                                style={{
                                    display: "block",
                                    color: "#374151",
                                    marginBottom: "8px",
                                    fontSize: "16px",
                                }}
                            >
                                ពាក្យសម្ងាត់
                            </label>
                            <div style={{ position: "relative" }}>
                                <div
                                    style={{
                                        position: "absolute",
                                        left: "16px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#9CA3AF",
                                    }}
                                >
                                    <svg
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                        }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    placeholder="បញ្ចូលពាក្យសម្ងាត់"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    style={{
                                        width: "100%",
                                        paddingLeft: "40px",
                                        paddingRight: "16px",
                                        paddingTop: "12px",
                                        paddingBottom: "12px",
                                        border: "1px solid #D1D5DB",
                                        borderRadius: "0.375rem",
                                        fontSize: "16px",
                                        outline: "none",
                                    }}
                                    autoComplete="current-password"
                                />
                            </div>
                            {errors.password && (
                                <div
                                    style={{
                                        color: "#EF4444",
                                        fontSize: "14px",
                                        marginTop: "8px",
                                    }}
                                >
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div style={{ marginBottom: "24px" }}>
                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "0.25rem",
                                        border: "1px solid #D1D5DB",
                                    }}
                                />
                                <span
                                    style={{
                                        marginLeft: "12px",
                                        color: "#4B5563",
                                        fontSize: "16px",
                                    }}
                                >
                                    ចងចាំខ្ញុំ
                                </span>
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                width: "100%",
                                padding: "14px 0",
                                backgroundColor: "#2563EB",
                                color: "white",
                                fontSize: "18px",
                                fontWeight: "500",
                                borderRadius: "0.375rem",
                                border: "none",
                                cursor: "pointer",
                                opacity: processing ? "0.5" : "1",
                            }}
                        >
                            ចូលប្រើប្រាស់
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div
                    style={{
                        padding: "16px 32px",
                        textAlign: "center",
                        borderTop: "1px solid #E5E7EB",
                    }}
                >
                    <p style={{ fontSize: "14px", color: "#9CA3AF" }}>
                        © {new Date().getFullYear()} Cambodia Land Tracker.
                        រក្សាសិទ្ធិគ្រប់យ៉ាង។
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}
