SELECT
  ap.id,
  GROUP_CONCAT(aps.permissionName) AS permissions
FROM
  users ap
  INNER JOIN roles ar ON ar.id = ap.roleId
  INNER JOIN roles_permissions arp ON arp.roleId = ar.id
  LEFT JOIN (
    SELECT
      id,
      name AS permissionName,
      STATUS
    FROM
      permissions
    WHERE
      STATUS = 'active'
  ) aps ON arp.permissionId = aps.id
WHERE
  ap.id = :id