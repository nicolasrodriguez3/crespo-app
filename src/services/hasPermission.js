import { PERMISSIONS } from "../constants/permissions"

export const hasPermission = ({section, roles}) =>
  roles.includes(PERMISSIONS[section])
