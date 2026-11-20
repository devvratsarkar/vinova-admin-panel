import React from "react";
import { Card } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";

/**
 * Placeholder page for Optometrist-only routes (Services, Working Rules, Availability, Prescriptions).
 * Replace with real implementation when ready.
 */
const PlaceholderPage = ({ title }) => (
  <>
    <PageHeader title={title} />
    <Card>
      <Card.Body>
        <p className="text-muted mb-0">This page is under development. Content will be available soon.</p>
      </Card.Body>
    </Card>
  </>
);

export default PlaceholderPage;
