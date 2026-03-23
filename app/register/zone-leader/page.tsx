import RoleRegisterForm from '@/components/forms/RoleRegisterForm'

export default function ZoneLeaderRegisterPage() {
  return <RoleRegisterForm roleName="Zone Leader" roleColorType="zone" endpoint="/api/register/zone-leader" icon="🛡️" />
}
