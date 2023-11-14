import { PERMISSIONS } from "../constants/PERMISSIONS"

export const hasPermission = ({ section, action, roles = [] }) => {
  const permission = PERMISSIONS[section][action]
  if (!permission) return false
  return roles.includes(permission)
}
