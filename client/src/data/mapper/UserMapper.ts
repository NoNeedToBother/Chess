import {Mapper} from "./Mapper";
import {User} from "../../models/User";
import {UserModelResponse} from "../model/UserModelResponse";
import {Role} from "../../models/Role";

export class UserMapper implements Mapper<UserModelResponse, User> {
    private roleMapper: RoleMapper

    constructor(roleMapper: RoleMapper) {
        this.roleMapper = roleMapper
    }

    map(response: UserModelResponse): User {
        return {
            id: response.id,
            username: response.username,
            name: response.name,
            lastname: response.lastname,
            profilePicture: response.profilePicture,
            bio: response.bio,
            dateRegistered: response.dateRegistered,
            roles: response.roles.map(role => this.roleMapper.map(role))
        }
    }

}

export class RoleMapper implements Mapper<string, Role> {
    map(response: string): Role {
        return Role[response as keyof typeof Role];
    }
}