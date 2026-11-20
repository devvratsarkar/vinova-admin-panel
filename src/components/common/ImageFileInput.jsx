import React, { useState, useEffect, useCallback, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/allModalSlice";

/**
 * Shows image preview with eye button for full-size preview in modal.
 * Use when you have custom file handling but need preview + eye button.
 * compact: use for gallery thumbnails (smaller size)
 */
export function ImagePreviewWithEye({ src, alt = "Preview", style, className = "", compact = false }) {
  const dispatch = useDispatch();
  if (!src) return null;
  const wrapperStyle = compact ? { maxWidth: "100px", display: "inline-block" } : { maxWidth: "200px" };
  return (
    <div className={`image-preview mt-3 position-relative ${className}`} style={wrapperStyle}>
      <img src={src} alt={alt} style={{ width: "100%", height: "auto", borderRadius: "8px", ...style }} />
      <Button
        variant="light"
        type="button"
        className="position-absolute"
        style={{ top: "4px", right: "4px", borderRadius: "50%", padding: compact ? "4px" : "8px" }}
        onClick={() => dispatch(openModal({ componentName: "ImagePreview", data: src }))}
      >
        <i className="fe fe-eye"></i>
      </Button>
    </div>
  );
}

/**
 * Reusable ImageFileInput with preview and eye button for full-size preview.
 * Use for all image file inputs across the project.
 */
export default function ImageFileInput({
  label,
  name,
  value,
  onChange,
  onBlur,
  accept = "image/*,.jpg,.jpeg,.png,.webp",
  error,
  touched,
  initialPreview = null,
  disabled = false,
  required = false,
  className = "",
  ...rest
}) {
  const dispatch = useDispatch();
  const fileUrlRef = useRef({ file: null, url: null });
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!initialPreview) {
      if (fileUrlRef.current.url) {
        URL.revokeObjectURL(fileUrlRef.current.url);
        fileUrlRef.current = { file: null, url: null };
      }
      setPreviewUrl(null);
      return () => {};
    }
    if (typeof initialPreview === "string" && (initialPreview.startsWith("http") || initialPreview.startsWith("blob") || initialPreview.startsWith("data"))) {
      setPreviewUrl(initialPreview);
      return () => {};
    }
    if (initialPreview instanceof File) {
      if (fileUrlRef.current.file === initialPreview && fileUrlRef.current.url) {
        setPreviewUrl(fileUrlRef.current.url);
        return () => {
          if (fileUrlRef.current.url) {
            URL.revokeObjectURL(fileUrlRef.current.url);
            fileUrlRef.current = { file: null, url: null };
          }
        };
      }
      if (fileUrlRef.current.url) URL.revokeObjectURL(fileUrlRef.current.url);
      const url = URL.createObjectURL(initialPreview);
      fileUrlRef.current = { file: initialPreview, url };
      setPreviewUrl(url);
      return () => {
        if (fileUrlRef.current.url) {
          URL.revokeObjectURL(fileUrlRef.current.url);
          fileUrlRef.current = { file: null, url: null };
        }
      };
    }
    setPreviewUrl(null);
    return () => {};
  }, [initialPreview]);

  const handleChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        onChange?.(e);
      } else {
        setPreviewUrl(initialPreview || null);
        onChange?.(e);
      }
    },
    [onChange, initialPreview]
  );

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handlePreviewClick = () => {
    if (previewUrl) {
      dispatch(openModal({ componentName: "ImagePreview", data: previewUrl }));
    }
  };

  return (
    <Form.Group className={className}>
      {label && (
        <Form.Label>
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}
      <Form.Control
        type="file"
        name={name}
        accept={accept}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        isInvalid={touched && error}
        {...rest}
      />
      {error && touched && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
      {previewUrl && (
        <div className="image-preview mt-3 position-relative" style={{ maxWidth: "200px" }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
          <Button
            variant="light"
            type="button"
            className="position-absolute"
            style={{ top: "10px", right: "10px", borderRadius: "50%", padding: "8px" }}
            onClick={handlePreviewClick}
          >
            <i className="fe fe-eye"></i>
          </Button>
        </div>
      )}
    </Form.Group>
  );
}
