import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import moment from "moment";
import { FaUserMd } from "react-icons/fa";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import Loader from "../../layouts/layoutcomponents/loader";
import Error from "../../layouts/layoutcomponents/Error";
import { openModal } from "../../redux/slices/allModalSlice";
import { useGetUserProfileQuery } from "../../redux/features/commonApiCall";
import { useGetOptometristUserProfileQuery } from "../../redux/features/optometristAPIEndPoint";
import { MEDIA_BASE_URL } from "../../utils/config";

const cardStyle = {
    border: "1px solid #e8edf3",
    borderRadius: 12,
    boxShadow: "none",
    background: "#fff",
};

const basePath = (import.meta.env.BASE_URL || "").replace(/\/$/, "");

function mediaUrl(src) {
    if (!src || typeof src !== "string") return "";
    if (/^(https?:|blob:|data:)/i.test(src)) return src;
    return `${MEDIA_BASE_URL.replace(/\/$/, "")}/${src.replace(/^\//, "")}`;
}

function asList(value) {
    const items = Array.isArray(value) ? value : [value];
    return items.flatMap((item) => String(item || "").split(",").map((part) => part.trim()).filter(Boolean));
}

function text(value) {
    if (value === undefined || value === null) return "";
    if (Array.isArray(value)) return asList(value).join(", ");
    return String(value).trim();
}

function Detail({ label, value }) {
    const shown = text(value);
    if (!shown) return null;
    return (
        <div style={{ padding: "14px 0", borderTop: "1px solid #f3f5f9" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "#64748b" }}>{label}</div>
            <div style={{ marginTop: 4, color: "#0f172a", whiteSpace: "pre-wrap" }}>{shown}</div>
        </div>
    );
}

export default function UserProfile() {
    const dispatch = useDispatch();
    const isOptometrist = localStorage.getItem("role") === "Optometrist";
    const optometristQuery = useGetOptometristUserProfileQuery(undefined, { skip: !isOptometrist });
    const adminQuery = useGetUserProfileQuery(undefined, { skip: isOptometrist });
    const { data, isFetching, error, isError, isLoading, isSuccess } = isOptometrist ? optometristQuery : adminQuery;
    const profile = data?.data?.userData || data?.data || {};
    const [photoFailed, setPhotoFailed] = useState(false);

    if (isFetching || isLoading) return <Loader />;
    if (isError) return <Error error_mes={error} />;
    if (!isSuccess) return null;

    const name = text(profile.name || profile.full_name) || "Profile";
    const initials = name.split(" ").filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
    const photo = photoFailed ? "" : mediaUrl(profile.profile_pic);
    const planName = text(profile.membership?.plan_name || profile.plan?.name);
    const planType = text(profile.membership?.plan_type || profile.plan_type);
    const planPeriod = planType === "MONTHLY" ? "Monthly" : planType === "YEARLY" ? "Yearly" : planType;
    const status = String(profile.optometrist_status || "").toLowerCase();
    const statusChip = {
        approved: { label: "Approved", bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
        rejected: { label: "Rejected", bg: "#fef2f2", color: "#b91c1c", border: "#fecaca" },
        pending: { label: "Pending approval", bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
    }[status];
    const dob = profile.dob ? moment(profile.dob).format("DD-MM-YYYY") : "";

    const personal = [
        { label: "Full name", value: profile.name || profile.full_name },
        { label: "Phone", value: profile.phone_number },
        { label: "Email", value: profile.email },
        { label: "Date of birth", value: dob },
    ];
    const practice = isOptometrist ? [
        { label: "Clinic", value: profile.store_name },
        { label: "Experience", value: profile.experience },
        { label: "Specialty", value: profile.specialty },
        { label: "Languages", value: profile.spoken_languages?.length ? profile.spoken_languages : profile.spoken_lang },
        { label: "State", value: profile.state },
        { label: "Country", value: profile.country },
        { label: "Address", value: profile.address || profile.user_address },
        { label: "About", value: profile.about },
    ] : [
        { label: "About", value: profile.about },
        { label: "Qualification", value: profile.qualification },
    ];

    return (
        <div>
            <PageHeader
                titles="Profile"
                active="Profile"
                items={["Home"]}
                links={[isOptometrist ? "/optometrist-dashboard/overview" : "/dashboard"]}
            />

            <Card className="mb-4" style={cardStyle}>
                <Card.Body className="p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div className="d-flex align-items-center gap-3">
                        <span
                            className="d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0"
                            style={{ width: 72, height: 72, borderRadius: 16, background: "#eff6ff", color: "#3b82f6", fontSize: 22, fontWeight: 700 }}
                        >
                            {photo ? (
                                <img
                                    src={photo}
                                    alt={name}
                                    onError={() => setPhotoFailed(true)}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                initials || <FaUserMd />
                            )}
                        </span>
                        <div>
                            <h4 className="fw-semibold mb-1" style={{ fontSize: "1.25rem" }}>{name}</h4>
                            {profile.store_name && <p className="text-muted mb-0">{profile.store_name}</p>}
                            {!profile.store_name && profile.email && <p className="text-muted mb-0">{profile.email}</p>}
                        </div>
                    </div>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        {(planName || planPeriod) && (
                            <span className="d-inline-flex align-items-center" style={{ background: "#f8fafc", border: "1px solid #e8edf3", borderRadius: 10, overflow: "hidden" }}>
                                {planName && <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13 }}>{planName}</span>}
                                {planPeriod && (
                                    <span className="px-3 py-2" style={{ fontSize: 12, color: "#64748b", borderLeft: planName ? "1px solid #e8edf3" : "none", background: "#fff" }}>
                                        {planPeriod}
                                    </span>
                                )}
                            </span>
                        )}
                        {statusChip && (
                            <span className="d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold" style={{ fontSize: 13, background: statusChip.bg, color: statusChip.color, border: `1px solid ${statusChip.border}`, borderRadius: 10 }}>
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusChip.color }} />
                                {statusChip.label}
                            </span>
                        )}
                        {isOptometrist ? (
                            <Link to={`${basePath}/optometrist-dashboard/profile`} className="btn btn-primary">
                                Edit profile
                            </Link>
                        ) : (
                            <button type="button" className="btn btn-primary" onClick={() => dispatch(openModal({ componentName: "updateProfile" }))}>
                                Edit profile
                            </button>
                        )}
                    </div>
                </Card.Body>
            </Card>

            <Card className="mb-4" style={cardStyle}>
                <Card.Body className="p-4">
                    <h5 className="fw-semibold mb-3">Personal information</h5>
                    <Row>
                        {personal.map((item) => (
                            <Col key={item.label} md={6}>
                                <Detail label={item.label} value={item.value} />
                            </Col>
                        ))}
                    </Row>
                    {practice.some((item) => text(item.value)) && (
                        <>
                            <h5 className="fw-semibold mt-4 mb-3">{isOptometrist ? "Practice" : "More"}</h5>
                            <Row>
                                {practice.map((item) => (
                                    <Col key={item.label} md={item.label === "About" || item.label === "Address" ? 12 : 6}>
                                        <Detail label={item.label} value={item.value} />
                                    </Col>
                                ))}
                            </Row>
                        </>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}
