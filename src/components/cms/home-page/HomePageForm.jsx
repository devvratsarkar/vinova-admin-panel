import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Card, Col, Form, Image, Row } from 'react-bootstrap';
import SelectWithDragDrop from '../../common/SelectWithDragDrop';
import { useFormik } from 'formik';
import PageHeader from '../../../layouts/layoutcomponents/pageheader';
import { useGetAllCategorySelectQuery } from '../../../redux/features/CategoryAPIEndPoint';
import { useGetBrandsSelectQuery } from '../../../redux/features/BrandAPIEndpoint';
import { useGetAllSelectFramesQuery } from '../../../redux/features/framesAPIEndPoint';
import { useGetCustomFieldShapesQuery } from '../../../redux/features/customFieldValueAPIEndPoint';
import { useAddUpdateHomePageMutation, useGetHomePageQuery } from '../../../redux/features/homePageAPIEndPoint';
import Loader from '../../../layouts/layoutcomponents/loader';
import toast from 'react-hot-toast';
import SeoForm from '../../seo-page/SeoForm';

const getNestedValue = (obj, path) => {
    try {
        return path.split('.').reduce((current, key) => current[key], obj) || '';
    } catch {
        return '';
    }
};

// Default visibility for every homepage section and sub-section.
// All visible unless overridden by saved data.
const SECTION_VISIBILITY_DEFAULTS = {
    // top-level sections
    sec1: true, sec2: true, sec3: true, sec4: true, sec5: true,
    sec6: true, sec7: true, sec8: true, sec9: true, sec10: true,
    sec11: true, sec12: true, sec13: true, sec14: true,
    feature: true, video_section: true,
    // sub-sections (inner toggles)
    sec2_men: true, sec2_women: true, sec2_kids: true,
    sec3_sunglass: true, sec3_specs: true,
    sec5_right: true, sec5_left: true,
    sec7_right: true, sec7_left: true,
    sec8_right: true, sec8_left: true,
    sec14_right: true, sec14_left: true,
};

// ─── SectionCard ─────────────────────────────────────────────────────────────
const SectionCard = ({ sectionKey, title, sectionNumber, isVisible, onVisibilityChange, defaultCollapsed = false, children }) => {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);

    const headerBg = isVisible ? '#f8f9fa' : '#fff8e1';
    const bodyBg   = isVisible ? '#ffffff' : '#fffdf0';

    return (
        <div className="mb-4 rounded-2" style={{ overflow: 'hidden', border: isVisible ? '1px solid #dee2e6' : '1px solid #ffc107' }}>
            {/* ── Header ── */}
            <div
                className="d-flex flex-wrap align-items-center justify-content-between gap-2 p-3"
                style={{ background: headerBg }}
            >
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    {sectionNumber != null && (
                        <span
                            className="rounded-2-pill px-2 py-1 text-white fw-semibold"
                            style={{ fontSize: '0.68rem', background: '#6c757d', letterSpacing: '0.02em' }}
                        >
                            #{sectionNumber}
                        </span>
                    )}
                    <span className="fw-semibold fs-6" style={{ color: '#1a1a2e' }}>{title}</span>
                    <span
                        className="rounded-2-pill px-2 py-1 fw-medium"
                        style={{
                            fontSize: '0.68rem',
                            background: isVisible ? '#d1fae5' : '#fef3c7',
                            color:      isVisible ? '#065f46' : '#92400e',
                        }}
                    >
                        {isVisible ? '● Visible' : '○ Hidden'}
                    </span>
                </div>

                <div className="d-flex align-items-center gap-3 flex-wrap">
                    <Form.Check
                        type="switch"
                        id={`section-vis-${sectionKey}`}
                        label={<small style={{ color: '#6b7280' }}>Show on site</small>}
                        checked={isVisible}
                        onChange={e => onVisibilityChange(e.target.checked)}
                        className="mb-0"
                    />
                    <button
                        type="button"
                        onClick={() => setCollapsed(c => !c)}
                        style={{
                            whiteSpace: 'nowrap', fontSize: '0.8rem', padding: '4px 10px',
                            border: '1px solid #ced4da', borderRadius: '6px',
                            background: '#fff', color: '#495057', cursor: 'pointer',
                        }}
                    >
                        {collapsed ? '▼ Expand' : '▲ Collapse'}
                    </button>
                </div>
            </div>

            {/* ── Body ── */}
            {!collapsed && (
                <div className="p-3" style={{ background: bodyBg }}>
                    {!isVisible && (
                        <div
                            className="d-flex align-items-start gap-2 rounded-2 px-3 py-2 mb-3"
                            style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e' }}
                        >
                            <span>⚠️</span>
                            <small>
                                This section is <strong>hidden</strong> from the live website.
                                Toggle <strong>"Show on site"</strong> above to publish it.
                            </small>
                        </div>
                    )}
                    {children}
                </div>
            )}
        </div>
    );
};

// ─── SubSectionPanel ─────────────────────────────────────────────────────────
// Visual container for nested panels inside a SectionCard.
// Pass `visKey`, `isVisible`, and `onVisibilityChange` to enable a per-sub-section toggle.
const SubSectionPanel = ({ title, visKey, isVisible = true, onVisibilityChange, children }) => {
    const hasToggle = visKey != null;
    const hidden = hasToggle && !isVisible;

    const headerBg    = hidden ? '#fff8e1' : '#f0f2f5';
    const outerBorder = hidden ? '1px solid #ffc107' : '1px solid #dee2e6';

    return (
        <div className="rounded-2 mb-3" style={{ overflow: 'hidden', border: outerBorder }}>
            {/* Sub-section header */}
            <div
                className="d-flex align-items-center justify-content-between px-3 py-2"
                style={{ background: headerBg }}
            >
                <div className="d-flex align-items-center gap-2">
                    <span className="fw-medium small" style={{ color: '#374151' }}>{title}</span>
                    {hasToggle && (
                        <span
                            className="rounded-2-pill px-2 py-1 fw-medium"
                            style={{
                                fontSize: '0.62rem',
                                background: isVisible ? '#d1fae5' : '#fef3c7',
                                color:      isVisible ? '#065f46' : '#92400e',
                            }}
                        >
                            {isVisible ? '● Visible' : '○ Hidden'}
                        </span>
                    )}
                </div>
                {hasToggle && (
                    <Form.Check
                        type="switch"
                        id={`inner-vis-${visKey}`}
                        label={<small style={{ color: '#6b7280' }}>Show</small>}
                        checked={isVisible}
                        onChange={e => onVisibilityChange(e.target.checked)}
                        className="mb-0"
                    />
                )}
            </div>

            {/* Sub-section body */}
            <div className="p-3" style={{ background: hidden ? '#fffdf0' : '#ffffff' }}>
                {hidden && (
                    <div
                        className="d-flex align-items-center gap-2 rounded-2 px-3 py-2 mb-3"
                        style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e' }}
                    >
                        <span>⚠️</span>
                        <small>This sub-section is <strong>hidden</strong> from the live website.</small>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
};

// ─── HomePageForm ─────────────────────────────────────────────────────────────
export default function HomePageForm({ lang }) {

    const [imagePreviews, setImagePreviews] = useState({});

    // API Queries
    const { data: category, isLoading: categoryLoading } = useGetAllCategorySelectQuery();
    const { data: brand, isLoading: brandLoading } = useGetBrandsSelectQuery();
    const { data: glasses, isLoading: glassesLoading } = useGetAllSelectFramesQuery();
    const { data: customFieldValue, isLoading: shapesLoading } = useGetCustomFieldShapesQuery();
    const { data: frames, isLoading: framesLoading } = useGetAllSelectFramesQuery();
    const { data, isLoading, refetch, isSuccess } = useGetHomePageQuery();
    const [addData, { isLoading: loadingAddData }] = useAddUpdateHomePageMutation();

    // Memoized data
    const singleData = useMemo(() => data?.data?.homePage || null, [data]);
    const categoryData = useMemo(() => category?.data || [], [category]);
    const brandDdata = useMemo(() => brand?.data || [], [brand]);
    const glaesesOptions = useMemo(() => glasses?.data || [], [glasses]);
    const shapesData = useMemo(() => customFieldValue?.data || [], [customFieldValue]);
    const framesData = useMemo(() => frames?.data || [], [frames]);
    const flattendShapesData = useMemo(() =>
        Array.isArray(shapesData) ? shapesData.flatMap(item => item.CustomFiledValue) : [],
        [shapesData]
    );

    // Select options
    const menCategoryOptions = useMemo(() =>
        Array.isArray(categoryData)
            ? categoryData.map(item => ({ label: item.category_name, value: item._id }))
            : [],
        [categoryData]
    );
    const brandOptions = useMemo(() =>
        Array.isArray(brandDdata)
            ? brandDdata.map(item => ({ label: item.name, value: item._id }))
            : [],
        [brandDdata]
    );
    const sunglasesOptions = useMemo(() =>
        Array.isArray(glaesesOptions)
            ? glaesesOptions.filter(item => item.type === 'sunglass').map(item => ({ label: item.name, value: item._id }))
            : [],
        [glaesesOptions]
    );
    const specsOptions = useMemo(() =>
        Array.isArray(glaesesOptions)
            ? glaesesOptions.filter(item => item.type === 'specs').map(item => ({ label: item.name, value: item._id }))
            : [],
        [glaesesOptions]
    );
    const shapesDataOptions = useMemo(() =>
        Array.isArray(flattendShapesData)
            ? flattendShapesData.map(item => ({ label: item?.attribute_name, value: item?._id }))
            : [],
        [flattendShapesData]
    );
    const framesOptions = useMemo(() =>
        Array.isArray(framesData)
            ? framesData.map(item => ({ label: item?.name, value: item?._id }))
            : [],
        [framesData]
    );

    const initialValues = useMemo(() => ({
        section_visibility: { ...SECTION_VISIBILITY_DEFAULTS },
        sec1: [{
            title: '', desc: '', banner: '', first_bnt_name: '', first_btn_link: '',
            sec_btn_name: '', sec_btn_link: '', title_color: '#fcfcfc', desc_color: '#fcfcfc',
            first_btn_color: '#fcfcfc', first_btn_text_color: '#fcfcfc', sec_btn_color: '#fcfcfc',
            sec_btn_text_color: '#fcfcfc',
        }],
        sec2: { men: [], women: [], kids: [] },
        sec3: { sunglass: [], specs: [] },
        sec4: { brands: [] },
        sec5: {
            right: { title: '', title_color: '#fcfcfc', desc: '', desc_color: '#fcfcfc', btn_text: '', btn_text_color: '#fcfcfc', btn_link: '', btn_bg_color: '#fcfcfc', image: '', bg_color: '#fcfcfc' },
            left: { title: '', title_color: '#fcfcfc', desc: '', desc_color: '#fcfcfc', btn_text: '', btn_text_color: '#fcfcfc', btn_link: '', btn_bg_color: '#fcfcfc', image: '', bg_color: '#fcfcfc' },
        },
        sec6: { title: '', desc: '', data: [{ icon: '', title: '', desc: '' }] },
        sec7: {
            title: '', desc: '',
            right: { title: '', title_color: '#fcfcfc', desc: '', desc_color: '#fcfcfc', btn_text: '', btn_text_color: '#fcfcfc', btn_link: '', btn_bg_color: '#fcfcfc', image: '', bg_color: '#fcfcfc' },
            left: { title: '', title_color: '#fcfcfc', desc: '', desc_color: '#fcfcfc', btn_text: '', btn_text_color: '#fcfcfc', btn_link: '', btn_bg_color: '#fcfcfc', image: '', bg_color: '#fcfcfc' },
        },
        sec8: {
            right: {
                title: '', title_color: '#fcfcfc', desc: '', desc_color: '#fcfcfc',
                btn_text: '', btn_text_color: '#fcfcfc', btn_link: '', btn_bg_color: '#fcfcfc',
                image: '', bg_color: '#fcfcfc',
                eye_specialist: { count: '', title: '', images: [] },
            },
            left: { title: '', title_color: '#fcfcfc', desc: '', desc_color: '#fcfcfc', btn_text: '', btn_text_color: '#fcfcfc', btn_link: '', btn_bg_color: '#fcfcfc', image: '', bg_color: '#fcfcfc' },
        },
        sec9: { title: '', desc: '', shapes: [] },
        sec10: { title: '', desc: '', btn_name: '', btn_link: '', btn_color: '#fcfcfc', btn_text_color: '#fcfcfc', bg_color: '#fcfcfc', image1: '', image2: '' },
        sec11: { img: '', title: '', desc: '', btn_name: '', btn_link: '' },
        sec12: [{ name: '', video: '', title: '', desc: '', specs: [] }],
        sec13: { image: '', t1: '', t2: '', d3images: [], btn_name: '', btn_link: '', btn_color: '#fcfcfc', btn_text_color: '#fcfcfc' },
        sec14: {
            right: { title: '', title_color: '#fcfcfc', desc: '', desc_color: '#fcfcfc', btn_text: '', btn_text_color: '#fcfcfc', btn_link: '', btn_bg_color: '#fcfcfc', image: '', brand: '', bg_color: '#fcfcfc' },
            left: { title: '', title_color: '#fcfcfc', desc: '', desc_color: '#fcfcfc', btn_text: '', btn_text_color: '#fcfcfc', btn_link: '', btn_bg_color: '#fcfcfc', image: '', brand: '', bg_color: '#fcfcfc' },
        },
        feature: [{ icon: '', name: '' }],
        video_section: { video: '', description: '' },
        lang: lang,
        meta_title: '', meta_description: '', meta_keywords: [], og_tag: '', schema_markup: '',
    }), []);

    const { values, touched, errors, handleSubmit, handleChange, handleBlur, setFieldValue } = useFormik({
        initialValues,
        onSubmit: async (values) => {
            const formData = new FormData();
            const flattenObjectForFormData = (obj, parentKey = '') => {
                Object.entries(obj).forEach(([key, value]) => {
                    // Strip translation wrapper — send fields directly without the prefix
                    if (key === 'translation' && !parentKey && typeof value === 'object' && value !== null) {
                        flattenObjectForFormData(value, parentKey);
                        return;
                    }

                    const formKey = parentKey ? `${parentKey}.${key}` : key;

                    if ((key === 'banner' || key === 'images') && Array.isArray(value)) {
                        value.forEach(item => {
                            if (item instanceof File) {
                                formData.append(formKey, item);
                            } else if (typeof item === 'string' && item) {
                                formData.append(formKey, item);
                            }
                        });
                    } else if ((key === 'image' || key === 'img' || key === 'icon' || key === 'video' || key === 'image1' || key === 'image2' || key === 'banner') && value) {
                        if (value instanceof File) {
                            formData.append(formKey, value);
                        } else if (typeof value === 'string') {
                            formData.append(formKey, value);
                        }
                    } else if (Array.isArray(value)) {
                        value.forEach((item, index) => {
                            if (typeof item === 'object' && item !== null) {
                                flattenObjectForFormData(item, `${formKey}[${index}]`);
                            } else {
                                formData.append(`${formKey}[${index}]`, item ?? '');
                            }
                        });
                    } else if (typeof value === 'object' && value !== null) {
                        flattenObjectForFormData(value, formKey);
                    } else {
                        formData.append(formKey, value ?? '');
                    }
                });
            };

            flattenObjectForFormData(values);

            try {
                const resp = await addData(formData);
                if (resp?.data?.http_status_code === 200 || resp?.data?.http_status_code === 201) {
                    toast.success(resp?.data?.message);
                    refetch();
                } else {
                    toast.error(resp?.data?.message);
                }
            } catch (err) {
                toast.error(err?.response?.data?.message);
            }
        },
    });

    const handleImageChange = useCallback((e, fieldPath, fieldName, isArray = false) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            if (isArray) {
                setFieldValue(`${fieldPath}.${fieldName}`, files);
                const previews = files.map(file => URL.createObjectURL(file));
                setImagePreviews(prev => ({ ...prev, [`${fieldPath}.${fieldName}`]: previews }));
            } else {
                const file = files[0];
                setFieldValue(`${fieldPath}.${fieldName}`, file);
                setImagePreviews(prev => ({ ...prev, [`${fieldPath}.${fieldName}`]: URL.createObjectURL(file) }));
            }
        }
    }, [setFieldValue]);

    const removeBannerImage = useCallback((fieldPath, fieldName, arrayIndex = null) => {
        if (arrayIndex !== null) {
            const currentArray = getNestedValue(values, `${fieldPath}.${fieldName}`) || [];
            const newArray = currentArray.filter((_, i) => i !== arrayIndex);
            setFieldValue(`${fieldPath}.${fieldName}`, newArray);

            const currentPreviews = imagePreviews[`${fieldPath}.${fieldName}`] || [];
            const removedPreview = currentPreviews[arrayIndex];
            if (removedPreview && removedPreview.startsWith('blob:')) URL.revokeObjectURL(removedPreview);
            setImagePreviews(prev => ({
                ...prev,
                [`${fieldPath}.${fieldName}`]: currentPreviews.filter((_, i) => i !== arrayIndex),
            }));
        } else {
            const currentPreview = imagePreviews[`${fieldPath}.${fieldName}`];
            if (currentPreview && currentPreview.startsWith('blob:')) URL.revokeObjectURL(currentPreview);
            setFieldValue(`${fieldPath}.${fieldName}`, '');
            setImagePreviews(prev => ({ ...prev, [`${fieldPath}.${fieldName}`]: '' }));
        }
    }, [setFieldValue, values, imagePreviews]);

    const addArrayItem = useCallback((fieldPath) => {
        let newItem;
        if (fieldPath === 'sec1') {
            newItem = {
                title: '', desc: '', banner: '', first_bnt_name: '', first_btn_link: '',
                sec_btn_name: '', sec_btn_link: '', title_color: '#fcfcfc', desc_color: '#fcfcfc',
                first_btn_color: '#fcfcfc', first_btn_text_color: '#fcfcfc', sec_btn_color: '#fcfcfc',
                sec_btn_text_color: '#fcfcfc',
            };
        } else if (fieldPath === 'sec6.data') {
            newItem = { icon: '', title: '', desc: '' };
        } else if (fieldPath === 'sec12') {
            newItem = { name: '', video: '', title: '', desc: '', specs: [] };
        } else {
            newItem = { icon: '', name: '' };
        }
        const currentArray = getNestedValue(values, fieldPath) || [];
        setFieldValue(fieldPath, [...currentArray, newItem]);
    }, [setFieldValue, values]);

    const removeArrayItem = useCallback((fieldPath, index) => {
        const currentArray = getNestedValue(values, fieldPath) || [];
        if (Array.isArray(currentArray)) {
            setFieldValue(fieldPath, currentArray.filter((_, i) => i !== index));
        }
    }, [setFieldValue, values]);

    // ── renderObjectFields ────────────────────────────────────────────────────
    const renderObjectFields = useCallback((fieldPath, fields, requiredFields = []) => {
        const item = getNestedValue(values, fieldPath) || {};
        const errorsObj = getNestedValue(errors, fieldPath) || {};

        const fieldLabel = key => {
            const map = {
                title: 'Section Title', desc: 'Section Description', banner: 'Banner Image',
                first_bnt_name: 'First Button Name', first_btn_link: 'First Button Link',
                sec_btn_name: 'Second Button Name', sec_btn_link: 'Second Button Link',
                title_color: 'Title Color', desc_color: 'Description Color',
                first_btn_color: 'First Button Color', first_btn_text_color: 'First Button Text Color',
                sec_btn_color: 'Second Button Color', sec_btn_text_color: 'Second Button Text Color',
                btn_text: 'Button Text', btn_text_color: 'Button Text Color', btn_link: 'Button Link',
                btn_bg_color: 'Button Background Color', bg_color: 'Background Color',
                btn_color: 'Button Color', image: 'Section Image', img: 'Main Image',
                image1: 'Image 1', image2: 'Image 2', icon: 'Icon', video: 'Video',
                count: 'Eye Specialist Count', images: 'Eye Specialist Images',
                brand: 'Brand', name: 'Name', t1: 'Title', d3images: 'Eye Wear',
                specs: 'Specs', description: 'Description',
            };
            return map[key] ?? key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
        };

        return (
            <div className="border mb-4 rounded-2-2 p-3">
                <Row>
                    {Object.keys(fields).map(key => {
                        const isRequired = requiredFields.includes(key);
                        return (
                            <Form.Group as={Col} md={4} key={`${fieldPath}-${key}`} className="mb-3">
                                <Form.Label>
                                    {fieldLabel(key)}
                                    {isRequired && <span className="text-danger"> *</span>}
                                </Form.Label>

                                {key === 'd3images' || key === 'specs' ? (
                                    <SelectWithDragDrop
                                        isMulti
                                        options={framesOptions}
                                        onChange={selected => setFieldValue(`${fieldPath}.${key}`, selected ? selected.map(o => o.value) : [])}
                                        value={(item[key] ?? []).map(id => framesOptions.find(o => o.value === id)).filter(Boolean)}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        isInvalid={!!errorsObj[key] && touched[fieldPath.split('.')[0]]?.[key]}
                                    />
                                ) : key === 'eye_specialist' ? (
                                    <div className="border p-3 rounded-2-2">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Eye Specialist Count</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name={`${fieldPath}.eye_specialist.count`}
                                                value={item.eye_specialist?.count || ''}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Eye Specialist Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name={`${fieldPath}.eye_specialist.title`}
                                                value={item.eye_specialist?.title || ''}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Eye Specialist Images</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={e => handleImageChange(e, fieldPath, 'eye_specialist.images', true)}
                                                onBlur={handleBlur}
                                            />
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                                                {(Array.isArray(item.eye_specialist?.images) ? item.eye_specialist.images : []).map((url, imgIdx) => (
                                                    <div key={`${fieldPath}.eye_specialist.images-${imgIdx}`} style={{ position: 'relative' }}>
                                                        <Image
                                                            src={imagePreviews[`${fieldPath}.eye_specialist.images`]?.[imgIdx] || url}
                                                            alt={`Eye Specialist Preview ${imgIdx}`}
                                                            style={{ width: '100px', height: '100px', objectFit: 'cover', border: '1px solid black', borderRadius: '10px' }}
                                                        />
                                                        <Button
                                                            variant="danger" size="sm"
                                                            style={{ position: 'absolute', top: '5px', right: '5px' }}
                                                            onClick={() => removeBannerImage(fieldPath, 'eye_specialist.images', imgIdx)}
                                                        >X</Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </Form.Group>
                                    </div>
                                ) : key === 'banner' || key === 'image' || key === 'img' || key === 'icon' || key === 'video' || key === 'image1' || key === 'image2' ? (
                                    <div>
                                        <Form.Control
                                            type="file"
                                            accept={key === 'video' ? 'video/*' : 'image/*'}
                                            onChange={e => handleImageChange(e, fieldPath, key, false)}
                                            onBlur={handleBlur}
                                            isInvalid={!!errorsObj[key] && touched[fieldPath.split('.')[0]]?.[key]}
                                        />
                                        <Form.Control.Feedback type="invalid">{errorsObj[key]}</Form.Control.Feedback>
                                        {item[key] && (
                                            key === 'video' ? (
                                                <video
                                                    src={imagePreviews[`${fieldPath}.${key}`] || item[key]}
                                                    controls
                                                    style={{ width: '200px', height: 'auto', marginTop: '10px', border: '1px solid black', borderRadius: '15px' }}
                                                />
                                            ) : (
                                                <div style={{ position: 'relative' }}>
                                                    <Image
                                                        src={imagePreviews[`${fieldPath}.${key}`] || item[key]}
                                                        alt={`${key} Preview`}
                                                        style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px', border: '1px solid black', borderRadius: '15px' }}
                                                    />
                                                    {key === 'banner' && (
                                                        <Button
                                                            variant="danger" size="sm"
                                                            style={{ position: 'absolute', top: '5px', right: '5px' }}
                                                            onClick={() => removeBannerImage(fieldPath, key)}
                                                        >X</Button>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : key.includes('color') ? (
                                    <>
                                        <Form.Control
                                            type="color"
                                            name={`${fieldPath}.${key}`}
                                            value={item[key] || '#fcfcfc'}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={!!errorsObj[key] && touched[fieldPath.split('.')[0]]?.[key]}
                                        />
                                        <Form.Control.Feedback type="invalid">{errorsObj[key]}</Form.Control.Feedback>
                                    </>
                                ) : key === 'brand' ? (
                                    <>
                                        <SelectWithDragDrop
                                            options={brandOptions}
                                            onChange={selected => setFieldValue(`${fieldPath}.${key}`, selected ? selected.value : '')}
                                            value={brandOptions.find(o => o.value === item[key])}
                                            className="basic-single-select"
                                            classNamePrefix="select"
                                            isInvalid={!!errorsObj[key] && touched[fieldPath.split('.')[0]]?.[key]}
                                        />
                                        <Form.Control.Feedback type="invalid">{errorsObj[key]}</Form.Control.Feedback>
                                    </>
                                ) : (
                                    <>
                                        <Form.Control
                                            type="text"
                                            name={`${fieldPath}.${key}`}
                                            value={item[key] || ''}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={!!errorsObj[key] && touched[fieldPath.split('.')[0]]?.[key]}
                                        />
                                        <Form.Control.Feedback type="invalid">{errorsObj[key]}</Form.Control.Feedback>
                                    </>
                                )}
                            </Form.Group>
                        );
                    })}
                </Row>
            </div>
        );
    }, [errors, touched, values, handleChange, handleBlur, setFieldValue, handleImageChange, removeBannerImage, framesOptions, brandOptions, imagePreviews]);

    // ── renderArrayFields ─────────────────────────────────────────────────────
    const renderArrayFields = useCallback((fieldPath, fields) => {
        const arrayData = getNestedValue(values, fieldPath) || [];
        const errorsArray = getNestedValue(errors, fieldPath) || [];

        const fieldLabel = key => {
            const map = {
                icon: 'Icon', name: 'Feature Name', title: 'Title', desc: 'Description',
                video: 'Video', specs: 'Specs', banner: 'Banner Image',
                first_bnt_name: 'First Button Name', first_btn_link: 'First Button Link',
                sec_btn_name: 'Second Button Name', sec_btn_link: 'Second Button Link',
                title_color: 'Title Color', desc_color: 'Description Color',
                first_btn_color: 'First Button Color', first_btn_text_color: 'First Button Text Color',
                sec_btn_color: 'Second Button Color', sec_btn_text_color: 'Second Button Text Color',
            };
            return map[key] ?? key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
        };

        const addBtnLabel = fieldPath === 'feature' ? 'Feature'
            : fieldPath === 'sec6.data' ? 'Data Item'
                : fieldPath === 'sec12' ? 'Fashion Highlights Item'
                    : 'Banner Slide';

        return (
            <>
                {arrayData.map((item, index) => (
                    <div key={`${fieldPath}-${index}`} className="border mb-4 rounded-2-2 p-3">
                        <Row>
                            {Object.keys(fields).map(key => (
                                <Form.Group as={Col} md={4} key={`${fieldPath}-${index}-${key}`} className="mb-3">
                                    <Form.Label>
                                        {fieldLabel(key)}
                                        <span className="text-danger"> *</span>
                                    </Form.Label>

                                    {key === 'specs' ? (
                                        <SelectWithDragDrop
                                            isMulti
                                            options={framesOptions}
                                            onChange={selected => setFieldValue(`${fieldPath}[${index}].${key}`, selected ? selected.map(o => o.value) : [])}
                                            value={(item[key] ?? []).map(id => framesOptions.find(o => o.value === id)).filter(Boolean)}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            isInvalid={!!errorsArray?.[index]?.[key] && touched[fieldPath.split('.')[0]]?.[index]?.[key]}
                                        />
                                    ) : key === 'icon' || key === 'video' || key === 'banner' ? (
                                        <div>
                                            <Form.Control
                                                type="file"
                                                accept={key === 'video' ? 'video/*' : 'image/*'}
                                                onChange={e => handleImageChange(e, `${fieldPath}[${index}]`, key, false)}
                                                onBlur={handleBlur}
                                                isInvalid={!!errorsArray?.[index]?.[key] && touched[fieldPath.split('.')[0]]?.[index]?.[key]}
                                            />
                                            <Form.Control.Feedback type="invalid">{errorsArray?.[index]?.[key]}</Form.Control.Feedback>
                                            {item[key] && (
                                                key === 'video' ? (
                                                    <video
                                                        src={imagePreviews[`${fieldPath}[${index}].${key}`] || item[key]}
                                                        controls
                                                        style={{ width: '200px', height: 'auto', marginTop: '10px', border: '1px solid black', borderRadius: '15px' }}
                                                    />
                                                ) : (
                                                    <div style={{ position: 'relative' }}>
                                                        <Image
                                                            src={imagePreviews[`${fieldPath}[${index}].${key}`] || item[key]}
                                                            alt="Preview"
                                                            style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px', border: '1px solid black', borderRadius: '15px' }}
                                                        />
                                                        {key === 'banner' && (
                                                            <Button
                                                                variant="danger" size="sm"
                                                                style={{ position: 'absolute', top: '5px', right: '5px' }}
                                                                onClick={() => removeBannerImage(`${fieldPath}[${index}]`, key)}
                                                            >X</Button>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <Form.Control
                                                type={key.includes('color') ? 'color' : 'text'}
                                                name={`${fieldPath}[${index}].${key}`}
                                                value={item[key] || (key.includes('color') ? '#fcfcfc' : '')}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={!!errorsArray?.[index]?.[key] && touched[fieldPath.split('.')[0]]?.[index]?.[key]}
                                            />
                                            <Form.Control.Feedback type="invalid">{errorsArray?.[index]?.[key]}</Form.Control.Feedback>
                                        </>
                                    )}
                                </Form.Group>
                            ))}
                        </Row>
                        <div className="d-flex align-items-center w-100 mt-2">
                            <Button variant="danger" size="sm" onClick={() => removeArrayItem(fieldPath, index)}>
                                Remove
                            </Button>
                        </div>
                    </div>
                ))}
                <Button variant="primary" onClick={() => addArrayItem(fieldPath)} className="mb-3 w-auto">
                    + Add {addBtnLabel}
                </Button>
            </>
        );
    }, [errors, touched, values, handleChange, handleBlur, setFieldValue, handleImageChange, removeArrayItem, addArrayItem, framesOptions, imagePreviews]);

    // ── renderSelectField ─────────────────────────────────────────────────────
    const renderSelectField = useCallback((fieldPath, label, options) => {
        const fieldValue = getNestedValue(values, fieldPath) || [];
        return (
            <Form.Group className="mb-3" key={fieldPath}>
                <Form.Label>{label}</Form.Label>
                <SelectWithDragDrop
                    isMulti
                    options={options}
                    onChange={selected => setFieldValue(fieldPath, selected ? selected.map(o => o.value) : [])}
                    value={fieldValue.map(id => options.find(o => o.value === id)).filter(Boolean)}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    isInvalid={!!errors[fieldPath] && touched[fieldPath]}
                />
                <Form.Control.Feedback type="invalid">{errors[fieldPath]}</Form.Control.Feedback>
            </Form.Group>
        );
    }, [setFieldValue, values, errors, touched]);

    // ── useEffect: populate from API ──────────────────────────────────────────
    useEffect(() => {
        if (isSuccess && singleData) {
            const setNestedValues = (obj, parentKey = '') => {
                Object.entries(obj).forEach(([key, value]) => {
                    if (['_id', 'createdAt', 'updatedAt', '__v'].includes(key)) return;

                    const fieldKey = parentKey ? `${parentKey}.${key}` : key;

                    if (Array.isArray(value)) {
                        if (['banner', 'images', 'men', 'women', 'kids', 'sunglass', 'specs', 'brands', 'shapes', 'd3images'].includes(key)) {
                            setFieldValue(fieldKey, value.map(item => item._id || item));
                            if (key === 'images') {
                                setImagePreviews(prev => ({ ...prev, [fieldKey]: value }));
                            }
                        } else if (key === 'feature' || key === 'data' || key === 'sec12') {
                            setFieldValue(fieldKey, value.map(item => ({
                                icon: item.icon || '', name: item.name || '',
                                title: item.title || '', desc: item.desc || '',
                                video: item.video || '', specs: item.specs || [],
                            })));
                            setImagePreviews(prev => ({
                                ...prev,
                                ...value.reduce((acc, item, index) => ({
                                    ...acc,
                                    ...(item.icon ? { [`${fieldKey}[${index}].icon`]: item.icon } : {}),
                                    ...(item.video ? { [`${fieldKey}[${index}].video`]: item.video } : {}),
                                }), {}),
                            }));
                        } else if (key === 'sec1') {
                            setFieldValue(fieldKey, value.map(item => ({
                                title: item.title || '', desc: item.desc || '',
                                banner: item.banner || '', first_bnt_name: item.first_bnt_name || '',
                                first_btn_link: item.first_btn_link || '', sec_btn_name: item.sec_btn_name || '',
                                sec_btn_link: item.sec_btn_link || '', title_color: item.title_color || '#fcfcfc',
                                desc_color: item.desc_color || '#fcfcfc', first_btn_color: item.first_btn_color || '#fcfcfc',
                                first_btn_text_color: item.first_btn_text_color || '#fcfcfc',
                                sec_btn_color: item.sec_btn_color || '#fcfcfc', sec_btn_text_color: item.sec_btn_text_color || '#fcfcfc',
                            })));
                            setImagePreviews(prev => ({
                                ...prev,
                                ...value.reduce((acc, item, index) => ({
                                    ...acc,
                                    ...(item.banner ? { [`${fieldKey}[${index}].banner`]: item.banner } : {}),
                                }), {}),
                            }));
                        }
                    } else if (typeof value === 'object' && value !== null) {
                        if (['image', 'img', 'video', 'image1', 'image2', 'icon', 'banner'].includes(key)) {
                            setFieldValue(fieldKey, value || '');
                            setImagePreviews(prev => ({ ...prev, [fieldKey]: value || '' }));
                        } else if (key === 'eye_specialist') {
                            setFieldValue(`${fieldKey}.count`, value.count || '');
                            setFieldValue(`${fieldKey}.title`, value.title || '');
                            setFieldValue(`${fieldKey}.images`, value.images || []);
                            setImagePreviews(prev => ({ ...prev, [`${fieldKey}.images`]: value.images || [] }));
                        } else if (key === 'section_visibility') {
                            // Load saved visibility overrides, keeping defaults for any missing keys
                            setFieldValue('section_visibility', {
                                ...SECTION_VISIBILITY_DEFAULTS,
                                ...value,
                            });
                        } else if (key === 'translation') {
                            // Unwrap translation wrapper — recurse at the same level so fields are
                            // set as sec1, sec2... instead of translation.sec1, translation.sec2...
                            setNestedValues(value, parentKey);
                        } else {
                            setNestedValues(value, fieldKey);
                        }
                    } else {
                        setFieldValue(fieldKey, value || '');
                    }
                });
            };

            setNestedValues(singleData);

            ['sec1', 'sec5.right', 'sec5.left', 'sec6', 'sec7.right', 'sec7.left', 'sec8.right', 'sec8.left', 'sec10', 'sec11', 'sec13', 'sec14.right', 'sec14.left', 'video_section'].forEach(path => {
                const currentValue = getNestedValue(singleData, path);
                if (!currentValue || (path === 'sec1' && (!Array.isArray(currentValue) || currentValue.length === 0))) {
                    const keys = path.split('.');
                    const fallback = keys.reduce((obj, key) => obj?.[key], initialValues);
                    setFieldValue(path, fallback);
                }
            });

            const sec12Value = getNestedValue(singleData, 'sec12');
            if (!sec12Value || !Array.isArray(sec12Value) || sec12Value.length === 0) {
                setFieldValue('sec12', initialValues.sec12);
            }
        }
    }, [isSuccess, singleData, setFieldValue, initialValues]);

    if (isLoading || categoryLoading || brandLoading || glassesLoading || shapesLoading || framesLoading) {
        return <Loader />;
    }

    // Visibility helpers (stable references not required here since SectionCard doesn't use React.memo)
    const getVis = key => values.section_visibility?.[key] !== false;
    const setVis = (key, val) => setFieldValue(`section_visibility.${key}`, val);

    // Shared field definitions reused across sections
    const SPLIT_PANEL_FIELDS = { title: '', title_color: '', desc: '', desc_color: '', btn_text: '', btn_text_color: '', btn_link: '', btn_bg_color: '', image: '', bg_color: '' };
    const SPLIT_PANEL_REQUIRED = ['title', 'desc', 'image'];
    const SPLIT_PANEL_BRAND_FIELDS = { ...SPLIT_PANEL_FIELDS, brand: '' };
    const SPLIT_PANEL_BRAND_REQUIRED = ['title', 'desc', 'image', 'brand'];

    return (
        <>
            {loadingAddData && <Loader />}
            <Form onSubmit={handleSubmit}>

                {/* ── 1. Banner ── */}
                <SectionCard
                    sectionKey="sec1" title="Banner" sectionNumber={1}
                    isVisible={getVis('sec1')} onVisibilityChange={v => setVis('sec1', v)}
                >
                    {renderArrayFields('sec1', {
                        title: '', desc: '', banner: '', first_bnt_name: '', first_btn_link: '',
                        sec_btn_name: '', sec_btn_link: '', title_color: '', desc_color: '',
                        first_btn_color: '', first_btn_text_color: '', sec_btn_color: '', sec_btn_text_color: '',
                    })}
                </SectionCard>

                {/* ── 2. Shop by Category ── */}
                <SectionCard
                    sectionKey="sec2" title="Shop by Category" sectionNumber={2}
                    isVisible={getVis('sec2')} onVisibilityChange={v => setVis('sec2', v)}
                    defaultCollapsed
                >
                    <SubSectionPanel title="Men Categories"
                        visKey="sec2_men" isVisible={getVis('sec2_men')} onVisibilityChange={v => setVis('sec2_men', v)}>
                        {renderSelectField('sec2.men', 'Men Categories', menCategoryOptions)}
                    </SubSectionPanel>
                    <SubSectionPanel title="Women Categories"
                        visKey="sec2_women" isVisible={getVis('sec2_women')} onVisibilityChange={v => setVis('sec2_women', v)}>
                        {renderSelectField('sec2.women', 'Women Categories', menCategoryOptions)}
                    </SubSectionPanel>
                    <SubSectionPanel title="Kids Categories"
                        visKey="sec2_kids" isVisible={getVis('sec2_kids')} onVisibilityChange={v => setVis('sec2_kids', v)}>
                        {renderSelectField('sec2.kids', 'Kids Categories', menCategoryOptions)}
                    </SubSectionPanel>
                </SectionCard>

                {/* ── 3. Wear The Trend ── */}
                <SectionCard
                    sectionKey="sec3" title="Wear The Trend" sectionNumber={3}
                    isVisible={getVis('sec3')} onVisibilityChange={v => setVis('sec3', v)}
                    defaultCollapsed
                >
                    <SubSectionPanel title="Sunglasses"
                        visKey="sec3_sunglass" isVisible={getVis('sec3_sunglass')} onVisibilityChange={v => setVis('sec3_sunglass', v)}>
                        {renderSelectField('sec3.sunglass', 'Sunglasses', sunglasesOptions)}
                    </SubSectionPanel>
                    <SubSectionPanel title="Specs"
                        visKey="sec3_specs" isVisible={getVis('sec3_specs')} onVisibilityChange={v => setVis('sec3_specs', v)}>
                        {renderSelectField('sec3.specs', 'Specs', specsOptions)}
                    </SubSectionPanel>
                </SectionCard>

                {/* ── 4. Shop By Brand ── */}
                <SectionCard
                    sectionKey="sec4" title="Shop By Brand" sectionNumber={4}
                    isVisible={getVis('sec4')} onVisibilityChange={v => setVis('sec4', v)}
                    defaultCollapsed
                >
                    {renderSelectField('sec4.brands', 'Brands', brandOptions)}
                </SectionCard>

                {/* ── 5. Try-On Options ── */}
                <SectionCard
                    sectionKey="sec5" title="Try-On Options" sectionNumber={5}
                    isVisible={getVis('sec5')} onVisibilityChange={v => setVis('sec5', v)}
                    defaultCollapsed
                >
                    <SubSectionPanel title="Right Section"
                        visKey="sec5_right" isVisible={getVis('sec5_right')} onVisibilityChange={v => setVis('sec5_right', v)}>
                        {renderObjectFields('sec5.right', SPLIT_PANEL_FIELDS, SPLIT_PANEL_REQUIRED)}
                    </SubSectionPanel>
                    <SubSectionPanel title="Left Section"
                        visKey="sec5_left" isVisible={getVis('sec5_left')} onVisibilityChange={v => setVis('sec5_left', v)}>
                        {renderObjectFields('sec5.left', SPLIT_PANEL_FIELDS, SPLIT_PANEL_REQUIRED)}
                    </SubSectionPanel>
                </SectionCard>

                {/* ── 6. Lifestyle Lens Guide ── */}
                <SectionCard
                    sectionKey="sec6" title="Lifestyle Lens Guide" sectionNumber={6}
                    isVisible={getVis('sec6')} onVisibilityChange={v => setVis('sec6', v)}
                    defaultCollapsed
                >
                    <Row className="border p-2 mb-3 rounded-2-2">
                        <Form.Group as={Col} md={6} className="mb-3">
                            <Form.Label>Section Title</Form.Label>
                            <Form.Control
                                name="sec6.title"
                                value={getNestedValue(values, 'sec6.title')}
                                onChange={handleChange} onBlur={handleBlur}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={6} className="mb-3">
                            <Form.Label>Section Description</Form.Label>
                            <Form.Control
                                as="textarea" name="sec6.desc"
                                value={getNestedValue(values, 'sec6.desc')}
                                onChange={handleChange} onBlur={handleBlur}
                            />
                        </Form.Group>
                    </Row>
                    <p className="text-muted fw-medium mb-2 small">Featured Cards</p>
                    {renderArrayFields('sec6.data', { icon: '', title: '', desc: '' })}
                </SectionCard>

                {/* ── 7. Complete Eye Care ── */}
                <SectionCard
                    sectionKey="sec7" title="Complete Eye Care" sectionNumber={7}
                    isVisible={getVis('sec7')} onVisibilityChange={v => setVis('sec7', v)}
                    defaultCollapsed
                >
                    <Row className="border p-2 mb-3 rounded-2-2">
                        <Form.Group as={Col} md={6} className="mb-3">
                            <Form.Label>Section Title</Form.Label>
                            <Form.Control
                                name="sec7.title"
                                value={getNestedValue(values, 'sec7.title')}
                                onChange={handleChange} onBlur={handleBlur}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={6} className="mb-3">
                            <Form.Label>Section Description</Form.Label>
                            <Form.Control
                                as="textarea" name="sec7.desc"
                                value={getNestedValue(values, 'sec7.desc')}
                                onChange={handleChange} onBlur={handleBlur}
                            />
                        </Form.Group>
                    </Row>
                    <SubSectionPanel title="Book Eye Exam"
                        visKey="sec7_right" isVisible={getVis('sec7_right')} onVisibilityChange={v => setVis('sec7_right', v)}>
                        {renderObjectFields('sec7.right', SPLIT_PANEL_FIELDS, SPLIT_PANEL_REQUIRED)}
                    </SubSectionPanel>
                    <SubSectionPanel title="Upload Prescription"
                        visKey="sec7_left" isVisible={getVis('sec7_left')} onVisibilityChange={v => setVis('sec7_left', v)}>
                        {renderObjectFields('sec7.left', SPLIT_PANEL_FIELDS, SPLIT_PANEL_REQUIRED)}
                    </SubSectionPanel>
                </SectionCard>

                {/* ── 8. Vision & Insurance ── */}
                <SectionCard
                    sectionKey="sec8" title="Vision & Insurance" sectionNumber={8}
                    isVisible={getVis('sec8')} onVisibilityChange={v => setVis('sec8', v)}
                    defaultCollapsed
                >
                    <SubSectionPanel title="Vision Check"
                        visKey="sec8_right" isVisible={getVis('sec8_right')} onVisibilityChange={v => setVis('sec8_right', v)}>
                        {renderObjectFields('sec8.right', {
                            ...SPLIT_PANEL_FIELDS,
                            eye_specialist: {},
                        }, SPLIT_PANEL_REQUIRED)}
                    </SubSectionPanel>
                    <SubSectionPanel title="Use Your Insurance"
                        visKey="sec8_left" isVisible={getVis('sec8_left')} onVisibilityChange={v => setVis('sec8_left', v)}>
                        {renderObjectFields('sec8.left', SPLIT_PANEL_FIELDS, SPLIT_PANEL_REQUIRED)}
                    </SubSectionPanel>
                </SectionCard>

                {/* ── Home Video Section ── */}
                <SectionCard
                    sectionKey="video_section" title="Home Video Section" sectionNumber={9}
                    isVisible={getVis('video_section')} onVisibilityChange={v => setVis('video_section', v)}
                    defaultCollapsed
                >
                    {renderObjectFields('video_section', { video: '', description: '' }, ['video', 'description'])}
                </SectionCard>

                {/* ── 9. Shop By Frame Shape ── */}
                <SectionCard
                    sectionKey="sec9" title="Shop By Frame Shape" sectionNumber={10}
                    isVisible={getVis('sec9')} onVisibilityChange={v => setVis('sec9', v)}
                    defaultCollapsed
                >
                    <Row className="border p-2 mb-3 rounded-2-2">
                        <Form.Group as={Col} md={6} className="mb-3">
                            <Form.Label>Section Title</Form.Label>
                            <Form.Control
                                name="sec9.title"
                                value={getNestedValue(values, 'sec9.title')}
                                onChange={handleChange} onBlur={handleBlur}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={6} className="mb-3">
                            <Form.Label>Section Description</Form.Label>
                            <Form.Control
                                as="textarea" name="sec9.desc"
                                value={getNestedValue(values, 'sec9.desc')}
                                onChange={handleChange} onBlur={handleBlur}
                            />
                        </Form.Group>
                    </Row>
                    {renderSelectField('sec9.shapes', 'Shapes', shapesDataOptions)}
                </SectionCard>

                {/* ── 10. Check Your Vision in Minutes ── */}
                <SectionCard
                    sectionKey="sec10" title="Check Your Vision in Minutes" sectionNumber={11}
                    isVisible={getVis('sec10')} onVisibilityChange={v => setVis('sec10', v)}
                    defaultCollapsed
                >
                    {renderObjectFields('sec10', {
                        title: '', desc: '', btn_name: '', btn_link: '',
                        btn_color: '', btn_text_color: '', bg_color: '', image1: '', image2: '',
                    }, ['title', 'desc', 'btn_name', 'btn_link'])}
                </SectionCard>

                {/* ── 11. Premium Brands ── */}
                <SectionCard
                    sectionKey="sec11" title="Premium Brands" sectionNumber={12}
                    isVisible={getVis('sec11')} onVisibilityChange={v => setVis('sec11', v)}
                    defaultCollapsed
                >
                    {renderObjectFields('sec11', {
                        img: '', title: '', desc: '', btn_name: '', btn_link: '',
                    }, ['img', 'title', 'desc', 'btn_name', 'btn_link'])}
                </SectionCard>

                {/* ── 12. Fashion Highlights ── */}
                <SectionCard
                    sectionKey="sec12" title="Fashion Highlights" sectionNumber={12}
                    isVisible={getVis('sec12')} onVisibilityChange={v => setVis('sec12', v)}
                    defaultCollapsed
                >
                    {renderArrayFields('sec12', { name: '', video: '', title: '', desc: '', specs: [] })}
                </SectionCard>

                {/* ── 13. 3D Viewer ── */}
                <SectionCard
                    sectionKey="sec13" title="3D Viewer" sectionNumber={13}
                    isVisible={getVis('sec13')} onVisibilityChange={v => setVis('sec13', v)}
                    defaultCollapsed
                >
                    {renderObjectFields('sec13', {
                        image: '', t1: '', d3images: [], btn_name: '', btn_link: '',
                        btn_color: '', btn_text_color: '',
                    }, ['image', 't1'])}
                </SectionCard>

                {/* ── 14. Featured Collections ── */}
                <SectionCard
                    sectionKey="sec14" title="Featured Collections" sectionNumber={15}
                    isVisible={getVis('sec14')} onVisibilityChange={v => setVis('sec14', v)}
                    defaultCollapsed
                >
                    <SubSectionPanel title="Right Section"
                        visKey="sec14_right" isVisible={getVis('sec14_right')} onVisibilityChange={v => setVis('sec14_right', v)}>
                        {renderObjectFields('sec14.right', SPLIT_PANEL_BRAND_FIELDS, SPLIT_PANEL_BRAND_REQUIRED)}
                    </SubSectionPanel>
                    <SubSectionPanel title="Left Section"
                        visKey="sec14_left" isVisible={getVis('sec14_left')} onVisibilityChange={v => setVis('sec14_left', v)}>
                        {renderObjectFields('sec14.left', SPLIT_PANEL_BRAND_FIELDS, SPLIT_PANEL_BRAND_REQUIRED)}
                    </SubSectionPanel>
                </SectionCard>

                {/* ── Why Choose Us ── */}
                <SectionCard
                    sectionKey="feature" title="Why Choose Us" sectionNumber={16}
                    isVisible={getVis('feature')} onVisibilityChange={v => setVis('feature', v)}
                    defaultCollapsed
                >
                    {renderArrayFields('feature', { icon: '', name: '' })}
                </SectionCard>

                {/* ── SEO ── */}
                <SeoForm
                    touched={touched}
                    handleChange={handleChange}
                    values={values}
                    errors={errors}
                    handleBlur={handleBlur}
                    readOnlyStatus={false}
                />

                <Row className="justify-content-center mt-4">
                    <Button type="submit" variant="primary" className="w-auto submit_btn">Submit</Button>
                    <Button type="submit" variant="primary" className="submit_btn_full">Submit</Button>
                </Row>
            </Form>
        </>
    );
}
