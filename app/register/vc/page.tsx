import RoleRegisterForm from '@/components/forms/RoleRegisterForm'

export default function VCRegisterPage() {
  return <RoleRegisterForm roleName="Venture Capitalist" roleColorType="vc" endpoint="/api/register/vc" icon="💼" />
}
