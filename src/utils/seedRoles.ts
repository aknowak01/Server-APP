import { RoleModel } from '../models/roleModels';
import { ROLE_FLAGS, Role } from "../models/roleModels";

export async function seedRoles() {
    const roleKeys = Object.keys(Role) as Role[];
    for(const role of roleKeys) {
        await RoleModel.updateOne(
            { name: role},
            { $set: { flags: ROLE_FLAGS[role]}},
            { upsert: true }
        );
    }



    console.log(`Seeding roles for ${roleKeys.length} roles.`);
}