import React, { useState, useEffect } from 'react';
import { Col, Form, Row, Card, Button, Image } from 'react-bootstrap';
import { useFormik } from 'formik';
import SunEditor from 'suneditor-react';
import { options_for_sunEditor } from '../../../commondata/formEditorOptions';
import { aboutUsValidationSchema } from '../../../commondata/formvalidations';
import { useAddUpdateAboutUsPageMutation, useGetAboutUsPageQuery } from '../../../redux/features/aboutUsAPIEndPoint';
import Loader from '../../../layouts/layoutcomponents/loader';
import toast from 'react-hot-toast';
import SeoForm from '../../seo-page/SeoForm';

const flattenFormErrors = (errors, parentPath = '') => {
    const paths = [];
    if (!errors || typeof errors !== 'object') return paths;

    Object.entries(errors).forEach(([key, value]) => {
        const path = parentPath ? `${parentPath}.${key}` : key;
        if (typeof value === 'string') {
            paths.push(path);
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                if (typeof item === 'string') {
                    paths.push(`${path}[${index}]`);
                } else if (item && typeof item === 'object') {
                    paths.push(...flattenFormErrors(item, `${path}[${index}]`));
                }
            });
        } else if (value && typeof value === 'object') {
            paths.push(...flattenFormErrors(value, path));
        }
    });
    return paths;
};

const ABOUT_US_FIELD_ORDER = [
    'sec1.image', 'sec1.title', 'sec1.desc',
    'sec2.title', 'sec2.desc',
    'sec3.title', 'sec3.sub_title',
    'sec3.first_box.image', 'sec3.first_box.title', 'sec3.first_box.desc',
    'sec3.second_box.image', 'sec3.second_box.title', 'sec3.second_box.desc',
    'sec3.third_box.image', 'sec3.third_box.title', 'sec3.third_box.desc',
    'sec3.forth_box.image', 'sec3.forth_box.title', 'sec3.forth_box.desc',
    'sec4.image', 'sec4.txt', 'sec4.title', 'sec4.sub_desc', 'sec4.desc',
    'sec5.image', 'sec5.txt', 'sec5.title', 'sec5.desc',
    'sec6.title', 'sec6.desc', 'sec6.image',
    'sec7.title', 'sec7.txt',
];

const sortErrorPathsByFormOrder = (errorPaths) => {
    const getFieldSortWeight = (path) => {
        const staticIdx = ABOUT_US_FIELD_ORDER.indexOf(path);
        if (staticIdx !== -1) return staticIdx * 1000;

        const secMatch = path.match(/^(sec\d+)/);
        if (secMatch) {
            let sectionBase = 0;
            for (let i = ABOUT_US_FIELD_ORDER.length - 1; i >= 0; i -= 1) {
                if (ABOUT_US_FIELD_ORDER[i].startsWith(`${secMatch[1]}.`)) {
                    sectionBase = i * 1000 + 500;
                    break;
                }
            }
            const arrayMatch = path.match(/\[(\d+)\]/);
            const arrayOffset = arrayMatch ? parseInt(arrayMatch[1], 10) * 10 : 0;
            return sectionBase + arrayOffset;
        }

        return 999999;
    };

    return [...errorPaths].sort((a, b) => getFieldSortWeight(a) - getFieldSortWeight(b));
};

const scrollToFirstError = (validationErrors) => {
    const errorPaths = sortErrorPathsByFormOrder(flattenFormErrors(validationErrors));
    if (!errorPaths.length) return;

    const scrollToElement = (element) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const focusable = element.matches('input, textarea, select')
            ? element
            : element.querySelector('input, textarea, select, [contenteditable="true"], .sun-editor-editable');
        focusable?.focus?.({ preventScroll: true });
    };

    requestAnimationFrame(() => {
        setTimeout(() => {
            for (const fieldPath of errorPaths) {
                const element =
                    document.getElementsByName(fieldPath)[0] ||
                    document.querySelector(`[data-field="${fieldPath}"]`);

                if (element) {
                    scrollToElement(element);
                    return;
                }
            }

            const firstErrorMessage = document.querySelector('.about-us-form .text-danger.text-sm');
            if (firstErrorMessage) {
                firstErrorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 150);
    });
};

const FieldAnchor = ({ fieldName, children }) => (
    <div data-field={fieldName}>{children}</div>
);

const showFieldError = (fieldError, submitCount) =>
    Boolean(fieldError && submitCount > 0);

const getNestedValue = (obj, path) =>
    path.split('.').reduce((current, key) => (current ? current[key] : undefined), obj);

const emptyBox = () => ({ image: null, title: '', desc: '' });

export default function AboutUsPageForm({ lang }) {
    const [imagePreviews, setImagePreviews] = useState({});

    const [addData, { isLoading: loadingAddData }] = useAddUpdateAboutUsPageMutation();
    const { data, isLoading, isSuccess, isFetching, refetch } = useGetAboutUsPageQuery(lang || 'en');
    const singleData = data?.data || null;

    const initialValues = {
        sec1: {
            image: null,
            title: '',
            desc: '',
        },
        sec2: {
            title: '',
            desc: '',
            btn_txt: '',
            btn_link: '',
        },
        sec3: {
            title: '',
            sub_title: '',
            first_box: emptyBox(),
            second_box: emptyBox(),
            third_box: emptyBox(),
            forth_box: emptyBox(),
        },
        sec4: {
            image: null,
            txt: '',
            title: '',
            sub_desc: '',
            desc: '',
        },
        sec5: {
            image: null,
            txt: '',
            title: '',
            desc: '',
            btn_txt: '',
            btn_link: '',
        },
        sec6: {
            image: [{ img: null, name: '', position: '' }],
            title: '',
            desc: '',
        },
        sec7: {
            title: '',
            txt: '',
            data: [{ title: '', sub_desc: '', desc: '' }],
        },
        lang: lang || 'en',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        og_tag: '',
        schema_markup: '',
    };

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        setFieldValue,
        setFieldTouched,
        setValues,
        submitForm,
        validateForm,
        submitCount,
        setSubmitting,
    } = useFormik({
        initialValues,
        validationSchema: aboutUsValidationSchema,
        enableReinitialize: false,
        onSubmit: async (formValues) => {
            const formData = new FormData();

            const flattenObjectForFormData = (obj, parentKey = '') => {
                Object.entries(obj).forEach(([key, value]) => {
                    const formKey = parentKey ? `${parentKey}.${key}` : key;

                    if (value instanceof File) {
                        formData.append(formKey, value);
                    } else if (Array.isArray(value)) {
                        value.forEach((item, index) => {
                            if (typeof item === 'object' && item !== null) {
                                flattenObjectForFormData(item, `${formKey}[${index}]`);
                            } else if (item !== null && item !== undefined) {
                                formData.append(`${formKey}[${index}]`, item ?? '');
                            }
                        });
                    } else if (typeof value === 'object' && value !== null) {
                        flattenObjectForFormData(value, formKey);
                    } else if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
                        // Keep existing remote image URLs out of FormData; backend retains previous file
                        return;
                    } else {
                        formData.append(formKey, value ?? '');
                    }
                });
            };

            flattenObjectForFormData({ ...formValues, lang: lang || 'en' });

            try {
                const resp = await addData(formData);
                if (resp?.data?.http_status_code === 200 || resp?.data?.http_status_code === 201) {
                    refetch();
                    toast.success(resp?.data?.message);
                } else {
                    toast.error(resp?.data?.message || 'Failed to save');
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || error?.message || 'An error occurred');
            }
        },
    });

    const handleImageChange = (e, fieldPath) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFieldValue(fieldPath, file);
        setFieldTouched(fieldPath, true);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreviews((prev) => ({
                ...prev,
                [fieldPath]: reader.result,
            }));
        };
        reader.readAsDataURL(file);
    };

    const addSec6Item = () => {
        setFieldValue('sec6.image', [...(values.sec6.image || []), { img: null, name: '', position: '' }]);
    };

    const removeSec6Item = (index) => {
        const next = (values.sec6.image || []).filter((_, i) => i !== index);
        setFieldValue('sec6.image', next.length ? next : [{ img: null, name: '', position: '' }]);
        setImagePreviews((prev) => {
            const updated = { ...prev };
            delete updated[`sec6.image[${index}].img`];
            return updated;
        });
    };

    const addSec7Item = () => {
        setFieldValue('sec7.data', [...(values.sec7.data || []), { title: '', sub_desc: '', desc: '' }]);
    };

    const removeSec7Item = (index) => {
        const next = (values.sec7.data || []).filter((_, i) => i !== index);
        setFieldValue('sec7.data', next.length ? next : [{ title: '', sub_desc: '', desc: '' }]);
    };

    const renderSingleImageField = (fieldPath, label = 'Image', required = false) => {
        const fieldError = getNestedValue(errors, fieldPath);
        return (
            <Form.Group className="mb-3">
                <Form.Label>
                    {label} {required && <span className="text-danger">*</span>}
                </Form.Label>
                <FieldAnchor fieldName={fieldPath}>
                    <Form.Control
                        type="file"
                        name={fieldPath}
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={(e) => handleImageChange(e, fieldPath)}
                        onBlur={() => setFieldTouched(fieldPath, true)}
                    />
                    {imagePreviews[fieldPath] && (
                        <Image
                            src={imagePreviews[fieldPath]}
                            alt="Preview"
                            style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }}
                        />
                    )}
                </FieldAnchor>
                {showFieldError(fieldError, submitCount) && (
                    <p className="text-danger text-sm mt-1">{fieldError}</p>
                )}
            </Form.Group>
        );
    };

    const renderBoxFields = (boxPath, boxLabel) => {
        const boxValues = getNestedValue(values, boxPath) || {};
        const boxErrors = getNestedValue(errors, boxPath) || {};

        return (
            <div className="mb-4">
                <h4>{boxLabel}</h4>
                <Row>
                    <Col md={6}>{renderSingleImageField(`${boxPath}.image`, 'Image')}</Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name={`${boxPath}.title`}
                                value={boxValues.title || ''}
                                onChange={(e) => setFieldValue(`${boxPath}.title`, e.target.value)}
                                onBlur={handleBlur}
                            />
                            {showFieldError(boxErrors.title, submitCount) && (
                                <p className="text-danger text-sm mt-1">{boxErrors.title}</p>
                            )}
                        </Form.Group>
                    </Col>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                            <FieldAnchor fieldName={`${boxPath}.desc`}>
                                <SunEditor
                                    key={`${lang}-${boxPath}-desc-${boxValues.desc?.slice?.(0, 20) || ''}`}
                                    name={`${boxPath}.desc`}
                                    onChange={(content) => setFieldValue(`${boxPath}.desc`, content)}
                                    onBlur={() => setFieldTouched(`${boxPath}.desc`, true)}
                                    setOptions={options_for_sunEditor}
                                    setContents={boxValues.desc || ''}
                                />
                            </FieldAnchor>
                            {showFieldError(boxErrors.desc, submitCount) && (
                                <p className="text-danger text-sm mt-2">{boxErrors.desc}</p>
                            )}
                        </Form.Group>
                    </Col>
                </Row>
            </div>
        );
    };

    useEffect(() => {
        setFieldValue('lang', lang || 'en');
    }, [lang, setFieldValue]);

    useEffect(() => {
        if (!isSuccess || !singleData) return;

        const newImagePreviews = {};

        const mapBox = (box) => ({
            image: box?.image || null,
            title: box?.title || '',
            desc: box?.desc || '',
        });

        if (singleData.sec1?.image) newImagePreviews['sec1.image'] = singleData.sec1.image;
        if (singleData.sec3?.first_box?.image) newImagePreviews['sec3.first_box.image'] = singleData.sec3.first_box.image;
        if (singleData.sec3?.second_box?.image) newImagePreviews['sec3.second_box.image'] = singleData.sec3.second_box.image;
        if (singleData.sec3?.third_box?.image) newImagePreviews['sec3.third_box.image'] = singleData.sec3.third_box.image;
        if (singleData.sec3?.forth_box?.image) newImagePreviews['sec3.forth_box.image'] = singleData.sec3.forth_box.image;
        if (singleData.sec4?.image) newImagePreviews['sec4.image'] = singleData.sec4.image;
        if (singleData.sec5?.image) newImagePreviews['sec5.image'] = singleData.sec5.image;

        const sec6Images = Array.isArray(singleData.sec6?.image) && singleData.sec6.image.length
            ? singleData.sec6.image.map((item, index) => {
                if (item?.img) newImagePreviews[`sec6.image[${index}].img`] = item.img;
                return {
                    img: item?.img || null,
                    name: item?.name || '',
                    position: item?.position || '',
                };
            })
            : [{ img: null, name: '', position: '' }];

        setValues({
            sec1: {
                image: singleData.sec1?.image || null,
                title: singleData.sec1?.title || '',
                desc: singleData.sec1?.desc || '',
            },
            sec2: {
                title: singleData.sec2?.title || '',
                desc: singleData.sec2?.desc || '',
                btn_txt: singleData.sec2?.btn_txt || '',
                btn_link: singleData.sec2?.btn_link || '',
            },
            sec3: {
                title: singleData.sec3?.title || '',
                sub_title: singleData.sec3?.sub_title || '',
                first_box: mapBox(singleData.sec3?.first_box),
                second_box: mapBox(singleData.sec3?.second_box),
                third_box: mapBox(singleData.sec3?.third_box),
                forth_box: mapBox(singleData.sec3?.forth_box),
            },
            sec4: {
                image: singleData.sec4?.image || null,
                txt: singleData.sec4?.txt || '',
                title: singleData.sec4?.title || '',
                sub_desc: singleData.sec4?.sub_desc || '',
                desc: singleData.sec4?.desc || '',
            },
            sec5: {
                image: singleData.sec5?.image || null,
                txt: singleData.sec5?.txt || '',
                title: singleData.sec5?.title || '',
                desc: singleData.sec5?.desc || '',
                btn_txt: singleData.sec5?.btn_txt || '',
                btn_link: singleData.sec5?.btn_link || '',
            },
            sec6: {
                title: singleData.sec6?.title || '',
                desc: singleData.sec6?.desc || '',
                image: sec6Images,
            },
            sec7: {
                title: singleData.sec7?.title || '',
                txt: singleData.sec7?.txt || '',
                data: Array.isArray(singleData.sec7?.data) && singleData.sec7.data.length
                    ? singleData.sec7.data.map((item) => ({
                        title: item?.title || '',
                        sub_desc: item?.sub_desc || '',
                        desc: item?.desc || '',
                    }))
                    : [{ title: '', sub_desc: '', desc: '' }],
            },
            lang: lang || 'en',
            meta_title: singleData?.meta_title || '',
            meta_description: singleData?.meta_description || '',
            meta_keywords: singleData?.meta_keywords || '',
            og_tag: singleData?.og_tag || '',
            schema_markup: singleData?.schema_markup || '',
        });

        setImagePreviews(newImagePreviews);
    }, [singleData, isSuccess, lang, setValues]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = await validateForm();
        if (validationErrors && Object.keys(validationErrors).length > 0) {
            setSubmitting(false);
            toast.error('Please fix the highlighted errors before submitting');
            scrollToFirstError(validationErrors);
            // force submitCount increment via submitForm which will fail validation again
            await submitForm();
            return;
        }
        await submitForm();
    };

    return (
        <>
            {(loadingAddData || isLoading || isFetching) && <Loader />}
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h3 className="card-title">About Us Page Content</h3>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleFormSubmit} className="about-us-form">
                                {/* Section 1 */}
                                <h4 className="mb-3">Section 1</h4>
                                <Row className="mb-4">
                                    <Col md={6}>{renderSingleImageField('sec1.image', 'Image')}</Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec1.title"
                                                value={values.sec1.title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {showFieldError(errors.sec1?.title, submitCount) && (
                                                <p className="text-danger text-sm mt-1">{errors.sec1.title}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                                            <FieldAnchor fieldName="sec1.desc">
                                                <SunEditor
                                                    key={`${lang}-sec1-desc`}
                                                    name="sec1.desc"
                                                    onChange={(content) => setFieldValue('sec1.desc', content)}
                                                    onBlur={() => setFieldTouched('sec1.desc', true)}
                                                    setOptions={options_for_sunEditor}
                                                    setContents={values.sec1.desc}
                                                />
                                            </FieldAnchor>
                                            {showFieldError(errors.sec1?.desc, submitCount) && (
                                                <p className="text-danger text-sm mt-1">{errors.sec1.desc}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Section 2 */}
                                <h4 className="mb-3">Section 2</h4>
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="text" name="sec2.title" value={values.sec2.title} onChange={handleChange} onBlur={handleBlur} />
                                            {showFieldError(errors.sec2?.title, submitCount) && <p className="text-danger text-sm mt-1">{errors.sec2.title}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                                            <FieldAnchor fieldName="sec2.desc">
                                                <SunEditor
                                                    key={`${lang}-sec2-desc`}
                                                    name="sec2.desc"
                                                    onChange={(content) => setFieldValue('sec2.desc', content)}
                                                    onBlur={() => setFieldTouched('sec2.desc', true)}
                                                    setOptions={options_for_sunEditor}
                                                    setContents={values.sec2.desc}
                                                />
                                            </FieldAnchor>
                                            {showFieldError(errors.sec2?.desc, submitCount) && <p className="text-danger text-sm mt-1">{errors.sec2.desc}</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Section 3 */}
                                <h4 className="mb-3">Section 3</h4>
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="text" name="sec3.title" value={values.sec3.title || ''} onChange={handleChange} onBlur={handleBlur} />
                                            {showFieldError(errors.sec3?.title, submitCount) && <p className="text-danger text-sm mt-1">{errors.sec3.title}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Subtitle</Form.Label>
                                            <Form.Control type="text" name="sec3.sub_title" value={values.sec3.sub_title || ''} onChange={handleChange} onBlur={handleBlur} />
                                            {showFieldError(errors.sec3?.sub_title, submitCount) && <p className="text-danger text-sm mt-1">{errors.sec3.sub_title}</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {renderBoxFields('sec3.first_box', 'First Box')}
                                {renderBoxFields('sec3.second_box', 'Second Box')}
                                {renderBoxFields('sec3.third_box', 'Third Box')}
                                {renderBoxFields('sec3.forth_box', 'Fourth Box')}

                                {/* Section 4 */}
                                <h4 className="mb-3">Section 4</h4>
                                <Row className="mb-4">
                                    <Col md={6}>{renderSingleImageField('sec4.image', 'Image')}</Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Text <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="text" name="sec4.txt" value={values.sec4.txt} onChange={handleChange} onBlur={handleBlur} />
                                            {showFieldError(errors.sec4?.txt, submitCount) && <p className="text-danger text-sm mt-1">{errors.sec4.txt}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="text" name="sec4.title" value={values.sec4.title} onChange={handleChange} onBlur={handleBlur} />
                                            {showFieldError(errors.sec4?.title, submitCount) && <p className="text-danger text-sm mt-1">{errors.sec4.title}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Sub-Description <span className="text-danger">*</span></Form.Label>
                                            <FieldAnchor fieldName="sec4.sub_desc">
                                                <SunEditor
                                                    key={`${lang}-sec4-sub_desc`}
                                                    name="sec4.sub_desc"
                                                    onChange={(content) => setFieldValue('sec4.sub_desc', content)}
                                                    onBlur={() => setFieldTouched('sec4.sub_desc', true)}
                                                    setOptions={options_for_sunEditor}
                                                    setContents={values.sec4.sub_desc}
                                                />
                                            </FieldAnchor>
                                            {showFieldError(errors.sec4?.sub_desc, submitCount) && <p className="text-danger text-sm mt-1">{errors.sec4.sub_desc}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                                            <FieldAnchor fieldName="sec4.desc">
                                                <SunEditor
                                                    key={`${lang}-sec4-desc`}
                                                    name="sec4.desc"
                                                    onChange={(content) => setFieldValue('sec4.desc', content)}
                                                    onBlur={() => setFieldTouched('sec4.desc', true)}
                                                    setOptions={options_for_sunEditor}
                                                    setContents={values.sec4.desc}
                                                />
                                            </FieldAnchor>
                                            {showFieldError(errors.sec4?.desc, submitCount) && <p className="text-danger text-sm mt-1">{errors.sec4.desc}</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Section 5 */}
                                <h4 className="mb-3">Section 5</h4>
                                <Row className="mb-4">
                                    <Col md={6}>{renderSingleImageField('sec5.image', 'Image')}</Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Text <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="text" name="sec5.txt" value={values.sec5.txt} onChange={handleChange} onBlur={handleBlur} />
                                            {showFieldError(errors.sec5?.txt, submitCount) && <p className="text-danger text-sm mt-1">{errors.sec5.txt}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="text" name="sec5.title" value={values.sec5.title} onChange={handleChange} onBlur={handleBlur} />
                                            {showFieldError(errors.sec5?.title, submitCount) && <p className="text-danger text-sm mt-1">{errors.sec5.title}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                                            <FieldAnchor fieldName="sec5.desc">
                                                <SunEditor
                                                    key={`${lang}-sec5-desc`}
                                                    name="sec5.desc"
                                                    onChange={(content) => setFieldValue('sec5.desc', content)}
                                                    onBlur={() => setFieldTouched('sec5.desc', true)}
                                                    setOptions={options_for_sunEditor}
                                                    setContents={values.sec5.desc}
                                                />
                                            </FieldAnchor>
                                            {showFieldError(errors.sec5?.desc, submitCount) && <p className="text-danger text-sm mt-1">{errors.sec5.desc}</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Section 6 */}
                                <h4 className="mb-3">Section 6</h4>
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="text" name="sec6.title" value={values.sec6.title} onChange={handleChange} onBlur={handleBlur} />
                                            {showFieldError(errors.sec6?.title, submitCount) && <p className="text-danger text-sm mt-1">{errors.sec6.title}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                                            <FieldAnchor fieldName="sec6.desc">
                                                <SunEditor
                                                    key={`${lang}-sec6-desc`}
                                                    name="sec6.desc"
                                                    onChange={(content) => setFieldValue('sec6.desc', content)}
                                                    onBlur={() => setFieldTouched('sec6.desc', true)}
                                                    setOptions={options_for_sunEditor}
                                                    setContents={values.sec6.desc}
                                                />
                                            </FieldAnchor>
                                            {showFieldError(errors.sec6?.desc, submitCount) && <p className="text-danger text-sm mt-1">{errors.sec6.desc}</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="mb-4">
                                    <h5>Team / Images</h5>
                                    {(values.sec6.image || []).map((item, index) => (
                                        <div key={index} className="border p-4 mb-3">
                                            <Row>
                                                <Col md={4}>
                                                    {renderSingleImageField(`sec6.image[${index}].img`, 'Image')}
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name={`sec6.image[${index}].name`}
                                                            value={item.name || ''}
                                                            onChange={(e) => setFieldValue(`sec6.image[${index}].name`, e.target.value)}
                                                            onBlur={handleBlur}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Position</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name={`sec6.image[${index}].position`}
                                                            value={item.position || ''}
                                                            onChange={(e) => setFieldValue(`sec6.image[${index}].position`, e.target.value)}
                                                            onBlur={handleBlur}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Button type="button" variant="danger" size="sm" onClick={() => removeSec6Item(index)}>
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="primary" onClick={addSec6Item} className="mb-3">
                                        Add Image Item
                                    </Button>
                                </div>

                                {/* Section 7 */}
                                <h4 className="mb-3">Section 7</h4>
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="text" name="sec7.title" value={values.sec7.title} onChange={handleChange} onBlur={handleBlur} />
                                            {showFieldError(errors.sec7?.title, submitCount) && <p className="text-danger text-sm mt-1">{errors.sec7.title}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Text <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="text" name="sec7.txt" value={values.sec7.txt} onChange={handleChange} onBlur={handleBlur} />
                                            {showFieldError(errors.sec7?.txt, submitCount) && <p className="text-danger text-sm mt-1">{errors.sec7.txt}</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="mb-4">
                                    <h5>Data <span className="text-danger">*</span></h5>
                                    {(values.sec7.data || []).map((item, index) => (
                                        <div key={index} className="border p-4 mb-3">
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Title</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name={`sec7.data[${index}].title`}
                                                            value={item.title || ''}
                                                            onChange={(e) => setFieldValue(`sec7.data[${index}].title`, e.target.value)}
                                                            onBlur={handleBlur}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Sub Description</Form.Label>
                                                        <FieldAnchor fieldName={`sec7.data[${index}].sub_desc`}>
                                                            <SunEditor
                                                                key={`${lang}-sec7-${index}-sub_desc`}
                                                                name={`sec7.data[${index}].sub_desc`}
                                                                onChange={(content) => setFieldValue(`sec7.data[${index}].sub_desc`, content)}
                                                                onBlur={() => setFieldTouched(`sec7.data[${index}].sub_desc`, true)}
                                                                setOptions={options_for_sunEditor}
                                                                setContents={item.sub_desc || ''}
                                                            />
                                                        </FieldAnchor>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Description</Form.Label>
                                                        <FieldAnchor fieldName={`sec7.data[${index}].desc`}>
                                                            <SunEditor
                                                                key={`${lang}-sec7-${index}-desc`}
                                                                name={`sec7.data[${index}].desc`}
                                                                onChange={(content) => setFieldValue(`sec7.data[${index}].desc`, content)}
                                                                onBlur={() => setFieldTouched(`sec7.data[${index}].desc`, true)}
                                                                setOptions={options_for_sunEditor}
                                                                setContents={item.desc || ''}
                                                            />
                                                        </FieldAnchor>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Button type="button" variant="danger" size="sm" onClick={() => removeSec7Item(index)}>
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="primary" onClick={addSec7Item} className="mb-3">
                                        Add Data Item
                                    </Button>
                                </div>

                                <Row>
                                    <SeoForm
                                        touched={touched}
                                        handleChange={handleChange}
                                        values={values}
                                        errors={errors}
                                        handleBlur={handleBlur}
                                        readOnlyStatus={false}
                                    />
                                </Row>

                                <Row className="mt-5 justify-content-center">
                                    <Button type="submit" variant="primary" className="w-auto submit_btn">Submit</Button>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
