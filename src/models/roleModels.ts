import mongoose, {Document, Schema} from 'mongoose';

export enum MainPermissionFlags {
    FORM_VIEW = 'form_view',
    FORM_ADD = 'form_add',
    FORM_EDIT = 'form_edit',
    QUALITY_CONTROL = 'quality_control',
    QUALITY_CONTROL_EDIT_PACKING = 'quality_control_edit_packing',
    QUALITY_CONTROL_EDIT_SEWING_CUTTING = 'quality_control_edit_sewing_cutting',
    QUALITY_CONTROL_EDIT_WAREHOUSE = 'quality_control_edit_warehouse',
    QUALITY_CONTROL_EDIT_MARKING = 'quality_control_edit_marking',
    USER_REGISTRATION = 'user_registration',
}

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
    MANAGER = 'MANAGER',
    SUPERVISOR_WAREHOUSE= 'SUPERVISOR_ODZIEZ_MAGAZYN',
    SUPERVISOR_SEWING_CUTTING = 'SUPERVISOR_SZWALNIA_KROJOWNIA',
    SUPERVISOR_MARKING = 'SUPERVISOR_ZNAKOWANIE',
    SUPERVISOR_PACKING = 'SUPERVISOR_KONFEKCJA',
    WAREHOUSE = 'WAREHOUSE',
    SEWING_CUTTING = 'SEWING_CUTTING',
    MARKING = 'MARKING',
    PACKING = 'PACKING',

    VENDOR = 'VENDOR',
}

export const QC_EDIT_FLAGS = [
    MainPermissionFlags.QUALITY_CONTROL,
    MainPermissionFlags.QUALITY_CONTROL_EDIT_WAREHOUSE,
    MainPermissionFlags.QUALITY_CONTROL_EDIT_SEWING_CUTTING,
    MainPermissionFlags.QUALITY_CONTROL_EDIT_MARKING,
    MainPermissionFlags.QUALITY_CONTROL_EDIT_PACKING,
];

export const ROLE_FLAGS: Record<Role, MainPermissionFlags[]> = {
    [Role.ADMIN]: Object.values(MainPermissionFlags),
    [Role.USER]: [MainPermissionFlags.FORM_VIEW,],
    [Role.MANAGER]: Object.values(MainPermissionFlags),
    [Role.SUPERVISOR_WAREHOUSE]: [
        MainPermissionFlags.FORM_VIEW,
        MainPermissionFlags.USER_REGISTRATION,
        MainPermissionFlags.QUALITY_CONTROL_EDIT_WAREHOUSE,
        MainPermissionFlags.QUALITY_CONTROL,
    ],
    [Role.SUPERVISOR_SEWING_CUTTING]: [
        MainPermissionFlags.FORM_VIEW,
        MainPermissionFlags.USER_REGISTRATION,
        MainPermissionFlags.QUALITY_CONTROL_EDIT_SEWING_CUTTING,
        MainPermissionFlags.QUALITY_CONTROL,
    ],
    [Role.SUPERVISOR_MARKING]: [
        MainPermissionFlags.FORM_VIEW,
        MainPermissionFlags.USER_REGISTRATION,
        MainPermissionFlags.QUALITY_CONTROL_EDIT_MARKING,
        MainPermissionFlags.QUALITY_CONTROL,
    ],
    [Role.SUPERVISOR_PACKING]: [
        MainPermissionFlags.FORM_VIEW,
        MainPermissionFlags.USER_REGISTRATION,
        MainPermissionFlags.QUALITY_CONTROL_EDIT_PACKING,
        MainPermissionFlags.QUALITY_CONTROL,
    ],
    [Role.WAREHOUSE]: [
        MainPermissionFlags.FORM_VIEW,
        MainPermissionFlags.QUALITY_CONTROL_EDIT_WAREHOUSE,
        MainPermissionFlags.QUALITY_CONTROL,
    ],
    [Role.SEWING_CUTTING]: [
        MainPermissionFlags.FORM_VIEW,
        MainPermissionFlags.QUALITY_CONTROL_EDIT_SEWING_CUTTING,
        MainPermissionFlags.QUALITY_CONTROL,
    ],
    [Role.MARKING]: [
        MainPermissionFlags.FORM_VIEW,
        MainPermissionFlags.QUALITY_CONTROL_EDIT_MARKING,
        MainPermissionFlags.QUALITY_CONTROL,
    ],
    [Role.PACKING]: [
        MainPermissionFlags.FORM_VIEW,
        MainPermissionFlags.QUALITY_CONTROL_EDIT_PACKING,
        MainPermissionFlags.QUALITY_CONTROL,
    ],
    [Role.VENDOR]: [
        MainPermissionFlags.FORM_ADD,
        MainPermissionFlags.FORM_EDIT,
        ...QC_EDIT_FLAGS,
        MainPermissionFlags.FORM_VIEW,
        MainPermissionFlags.QUALITY_CONTROL,
    ],
};

export interface IRoleDoc extends Document {
    name: Role;
    flags: MainPermissionFlags[];
}


const RoleSchema = new Schema<IRoleDoc>({
    name: {type: String, enum: Object.values(Role), required: true, unique: true},
    flags: {
        type: [String],
        enum: Object.values(MainPermissionFlags),
        required: true,
    },
});
export const RoleModel =
    mongoose.models.Role ||
    mongoose.model<IRoleDoc>('Role', RoleSchema, 'roles');
