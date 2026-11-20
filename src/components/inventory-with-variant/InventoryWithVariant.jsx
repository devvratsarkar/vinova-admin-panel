import React from 'react'
import { Row, Card, Col } from "react-bootstrap";
import { InventoryWithVariantDataTable } from '../../commondata/inventoryWithVariantdata';
export default function InventoryWithVariant({ viewingTrash = false }) {
    return (

        <div className="table-responsive">
            <InventoryWithVariantDataTable viewingTrash={viewingTrash} />
        </div>

    )
}
