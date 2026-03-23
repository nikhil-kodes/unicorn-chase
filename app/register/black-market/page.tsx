import RoleRegisterForm from '@/components/forms/RoleRegisterForm'

export default function BlackMarketRegisterPage() {
  return <RoleRegisterForm roleName="Black Market" roleColorType="bm" endpoint="/api/register/black-market" icon="💣" />
}
