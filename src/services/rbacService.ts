export interface Permission {
    name: string;
}

export const Permissions: Permission[] = [
    { name: 'READ_FORMS', },
    { name: 'WRITE_FORMS', description: 'Permission to write articles' },
    { name: 'DELETE_FORMS', description: 'Permission to delete articles'},