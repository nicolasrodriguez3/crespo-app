import { PERMISSIONS } from "../constants/PERMISSIONS"

export const hasPermission = ({ section, roles }) =>
  roles.includes(PERMISSIONS[section])
