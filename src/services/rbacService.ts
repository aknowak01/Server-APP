export interface Permission {
    name: string;
    description?: string;
}

export const Permissions: Permission[] = [
    { name: 'READ_FORMS', },
    { name: 'WRITE_FORMS', description: 'Permission to write articles' },
    { name: 'DELETE_FORMS', description: 'Permission to delete articles'},
    { name: 'MANAGE_USERS', description: 'Permission to manage users'},
];


export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
    return userPermissions.includes(requiredPermission);
}

export function addPermission(userPermissions: string[], permissionToAdd: string): string[] {
    if (!userPermissions.includes(permissionToAdd)) {
        userPermissions.push(permissionToAdd);
    }
    return userPermissions;
}

export function removePermission(userPermissions: string[], permissionToRemove: string): string[] {
    return userPermissions.filter(permission => permission !== permissionToRemove);
}
export function listPermissions(userPermissions: string[]): string[] {

    return userPermissions;
}
