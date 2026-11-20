export const PERMISSION_OPTIONS = [
    { value: "view", label: "view" },
    { value: "add", label: "add" },
    { value: "edit", label: "edit" },
    { value: "delete", label: "delete" },
    { value: "add-trash", label: "add-trash" },
    { value: "view-trash", label: "view-trash" },
    { value: "restore-trash", label: "restore-trash" },
    { value: "import", label: "import" },
    { value: "export", label: "export" },
    { value: "reviewer", label: "reviewer" },
];

export const buildUserPermissions = (modelNameList) =>
    modelNameList.map((model) => ({
        name: model,
        permissions: [],
    }));

export const mapRolePermissionsToForm = (modelNameList, rolePermissions = []) =>
    modelNameList.map((model) => {
        const permission = rolePermissions.find((item) => item.model === model) || {};
        const permissions =
            permission.Permission ||
            permission.permissions ||
            (Array.isArray(permission) ? permission : []);

        return {
            name: model,
            permissions: Array.isArray(permissions) ? permissions : [],
        };
    });

export const handlePermissionSelection = (selectedOptions, modelIndex, currentPermissions, setFieldValue) => {
    const updatedPermissions = selectedOptions ? selectedOptions.map((option) => option.value) : [];

    if (updatedPermissions.length > 0 && !updatedPermissions.includes("view")) {
        updatedPermissions.push("view");
    }

    const updatedUserPermissions = [...currentPermissions];
    updatedUserPermissions[modelIndex].permissions = updatedPermissions;
    setFieldValue("user_permission", updatedUserPermissions);
};

export const formatRoleName = (name) => {
    if (!name) return "N/A";
    return name
        .split(/[-_\s]+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
};
