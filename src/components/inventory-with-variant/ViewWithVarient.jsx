import React, { useEffect } from "react";
import { Row, Col, Card, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { useGetProductInventoryVariantQuery, useGetInventoryAttributesQuery } from "../../redux/features/inventory";

/**
 * Builds variant display label as "attribute_name - value_name" for each pair, one per line.
 */
const getVariantDisplayLabel = (variant, allAttributes) => {
  if (Array.isArray(variant?.attributesMapped) && variant.attributesMapped.length > 0) {
    return variant.attributesMapped
      .map((item) => {
        const attrName = item?.attribute?.attribute_name ?? "";
        const valueName = item?.value?.attribute_name ?? "";
        return attrName ? `${attrName} - ${valueName}` : valueName;
      })
      .filter(Boolean)
      .join("\n");
  }
  if (allAttributes?.length && Array.isArray(variant?.attribute) && Array.isArray(variant?.attribute_value)) {
    return variant.attribute
      .map((attrId, index) => {
        const attribute = allAttributes.find((a) => a._id === attrId);
        const valueId = variant.attribute_value[index];
        const valueObj = attribute?.values?.find((v) => v._id === valueId);
        const attrName = attribute?.attribute_name ?? "";
        const valueName = valueObj?.attribute_name ?? valueId ?? "";
        return attrName ? `${attrName} - ${valueName}` : valueName;
      })
      .filter(Boolean)
      .join("\n");
  }
  return variant?.variant ?? "";
};

function ViewWithVarient() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const { data, refetch } = useGetProductInventoryVariantQuery({ id: id, type: type });
  const { data: attributesData } = useGetInventoryAttributesQuery(id, { skip: !id });
  const singleProductVariants = data?.data || [];
  const allAttributes = attributesData?.data?.customFields ?? [];


  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <>
      <PageHeader titles="Stock-Inventory" active="view" items={['Home', 'Inventory List']} links={["/dashboard", () => navigate(-1)]} />
      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">View Inventory</Card.Title>&nbsp;|&nbsp;<p className="fw-bold">Size : &nbsp; <span className="text-success">{type}</span></p>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive inventory_with_variant_form">
                <form>
                  <Table className="variant_form">
                    <thead className="border-bottom">
                      <tr>
                        <th>Variant<span className="text-danger">*</span></th>
                        <th>Image<span className="text-danger">*</span></th>
                        <th>Sku<span className="text-danger">*</span></th>
                        <th>Stock<span className="text-danger">*</span></th>
                        <th>MRP($)<span className="text-danger">*</span></th>
                        <th>Selling Price($)<span className="text-danger">*</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {singleProductVariants.map((variant, indec) => (
                        <tr key={indec} className="border-bottom">
                          <td className="variant_field" style={{ whiteSpace: "pre-line" }}>
                            {getVariantDisplayLabel(variant, allAttributes)}
                          </td>
                          <td className="add_variant_image_field">
                            <div className="d-flex flex-wrap gap-1">
                              {Array.isArray(variant.image)
                                ? variant.image.map((img, i) => (
                                    <img key={i} src={img} alt="variant" width={50} height={50} style={{ objectFit: "cover", borderRadius: "4px", border: "1px solid #ddd" }} />
                                  ))
                                : variant.image
                                  ? <img src={variant.image} alt="variant" width={50} height={50} style={{ objectFit: "cover", borderRadius: "4px", border: "1px solid #ddd" }} />
                                  : <span className="text-muted">—</span>}
                            </div>
                          </td>
                          <td className="boxed-content">
                            <input
                              type="text"
                              defaultValue={variant.sku}
                              name={`sku_${variant._id}`}
                              readOnly
                              className="variant_input_field"
                            />
                          </td>
                          <td className="boxed-content">
                            <input
                              type="number"
                              defaultValue={variant.stock_quantity}
                              name={`stock_quantity_${variant._id}`}
                              readOnly
                              className="variant_input_field"
                            />
                          </td>
                          <td className="boxed-content">
                            <input
                              type="number"
                              defaultValue={variant.mrp}
                              name={`mrp_${variant._id}`}
                              readOnly
                              className="variant_input_field"
                            />
                          </td>
                          <td className="boxed-content">
                            <input
                              type="number"
                              defaultValue={variant.selling_price}
                              name={`selling_price_${variant._id}`}
                              readOnly
                              className="variant_input_field"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </form>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default ViewWithVarient;
