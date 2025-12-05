import mongoose, {Document, Schema} from 'mongoose';

export enum PermissionFlag {
    FORM_VIEW = 'form_view',
    FORM_ADD = 'form_add',
    FORM_EDIT = 'form_edit',
    QUALITY_CONTROL = 'quality_control',
    QUALITY_CONTROL_EDIT_ODZIEZ_MAGAZYN = 'quality_control_edit_odziez_magazyn',
    QUALITY_CONTROL_EDIT_SZWALNIA_KROJOWNIA = 'quality_control_edit_szwalnia_krojownia',
    QUALITY_CONTROL_EDIT_ZNAKOWANIE = 'quality_control_edit_znakowanie',
    QUALITY_CONTROL_EDIT_KONFEKCJA = 'quality_control_edit_konfekcja',
    USER_REGISTRATION = 'user_registration',
}

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
    MANAGER = 'MANAGER',
    SUPERVISOR_ODZIEZ_MAGAZYN = 'SUPERVISOR_ODZIEZ_MAGAZYN',
    SUPERVISOR_SZWALNIA_KROJOWNIA = 'SUPERVISOR_SZWALNIA_KROJOWNIA',
    SUPERVISOR_ZNAKOWANIE = 'SUPERVISOR_ZNAKOWANIE',
    SUPERVISOR_KONFEKCJA = 'SUPERVISOR_KONFEKCJA',
    VENDOR = 'VENDOR',
}

export const QC_EDIT_FLAGS = [
    PermissionFlag.QUALITY_CONTROL,
    PermissionFlag.QUALITY_CONTROL_EDIT_ODZIEZ_MAGAZYN,
    PermissionFlag.QUALITY_CONTROL_EDIT_SZWALNIA_KROJOWNIA,
    PermissionFlag.QUALITY_CONTROL_EDIT_ZNAKOWANIE,
    PermissionFlag.QUALITY_CONTROL_EDIT_KONFEKCJA,
];

export const ROLE_FLAGS: Record<Role, PermissionFlag[]> = {
    [Role.ADMIN]: Object.values(PermissionFlag),
    [Role.USER]: [PermissionFlag.FORM_VIEW,],
    [Role.MANAGER]: Object.values(PermissionFlag),
    [Role.SUPERVISOR_ODZIEZ_MAGAZYN]: [
        PermissionFlag.FORM_VIEW,
        PermissionFlag.USER_REGISTRATION,
        PermissionFlag.QUALITY_CONTROL_EDIT_ODZIEZ_MAGAZYN,
        PermissionFlag.QUALITY_CONTROL,
    ],
    [Role.SUPERVISOR_SZWALNIA_KROJOWNIA]: [
        PermissionFlag.FORM_VIEW,
        PermissionFlag.USER_REGISTRATION,
        PermissionFlag.QUALITY_CONTROL_EDIT_SZWALNIA_KROJOWNIA,
        PermissionFlag.QUALITY_CONTROL,
    ],
    [Role.SUPERVISOR_ZNAKOWANIE]: [
        PermissionFlag.FORM_VIEW,
        PermissionFlag.USER_REGISTRATION,
        PermissionFlag.QUALITY_CONTROL_EDIT_ZNAKOWANIE,
        PermissionFlag.QUALITY_CONTROL,
    ],
    [Role.SUPERVISOR_KONFEKCJA]: [
        PermissionFlag.FORM_VIEW,
        PermissionFlag.USER_REGISTRATION,
        PermissionFlag.QUALITY_CONTROL_EDIT_KONFEKCJA,
        PermissionFlag.QUALITY_CONTROL,
    ],
    [Role.VENDOR]: [
        PermissionFlag.FORM_ADD,
        PermissionFlag.FORM_EDIT,
        ...QC_EDIT_FLAGS,
        PermissionFlag.FORM_VIEW,
        PermissionFlag.QUALITY_CONTROL,
    ],
};

export interface IRoleDoc extends Document {
    name: Role;
    flags: PermissionFlag[];
}


const RoleSchema = new Schema<IRoleDoc>({
    name: {type: String, enum: Object.values(Role), required: true, unique: true},
    flags: {
        type: [String],
        enum: Object.values(PermissionFlag),
        required: true,
    },
});
export const RoleModel =
    mongoose.models.Role ||
    mongoose.model<IRoleDoc>('Role', RoleSchema, 'roles');
