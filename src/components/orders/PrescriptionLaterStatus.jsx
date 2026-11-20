import React from "react";
import { MdOutlineDescription, MdOutlineWatchLater } from "react-icons/md";

export function isPrescriptionPending(item) {
    if (!item?.i_will_send_prescription_later) return false;
    return !item?.prescription && !item?.prescription_id;
}

export function PrescriptionLaterChip() {
    return (
        <span className="prescription-later-chip">
            <MdOutlineWatchLater />
            Will send later
        </span>
    );
}

export function PrescriptionPendingBanner({ count = 1 }) {
    return (
        <div className="prescription-pending-banner">
            <div className="prescription-pending-banner__icon">
                <MdOutlineWatchLater />
            </div>
            <div className="prescription-pending-banner__content">
                <div className="d-flex align-items-center flex-wrap gap-2">
                    <span className="prescription-pending-banner__title">Prescription Status</span>
                    <PrescriptionLaterChip />
                </div>
                <p className="prescription-pending-banner__text mb-0">
                    {count > 1
                        ? `Customer will send the prescription later for ${count} items.`
                        : "Customer will send the prescription later for a pending item."}
                </p>
            </div>
        </div>
    );
}

export function PrescriptionDetailCard({ later, children }) {
    return (
        <div className="prescription-detail-card">
            <div className="prescription-detail-card__header">
                <div className="d-flex align-items-center gap-2">
                    <span className="prescription-detail-card__icon">
                        <MdOutlineDescription />
                    </span>
                    <h6 className="prescription-detail-card__title mb-0">Prescription</h6>
                </div>
                {later && <PrescriptionLaterChip />}
            </div>
            {children}
        </div>
    );
}
