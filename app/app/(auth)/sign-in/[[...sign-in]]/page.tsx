import { SignIn } from '@clerk/nextjs';

export default function Page() {
	return (
		<div className='flex items-center top-20 '>
			<SignIn forceRedirectUrl='/dashboard' signUpUrl='sign-up' />;
		</div>
	);
}
