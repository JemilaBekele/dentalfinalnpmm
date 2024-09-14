import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import dynamic from 'next/dynamic';

// Dynamically import components
const DynamicLoginForm = dynamic(() => import('@/app/components/Login'), {
  ssr: false, // Disable server-side rendering for this component
});

const DynamicClientSideRedirect = dynamic(() => import('@/app/components/ClientSideRedirect'), {
  ssr: false, // Disable server-side rendering for this component
});

export default async function SignInPage() {
  const session = await getServerSession(options);

  // Return either LoginForm or ClientSideRedirect based on session state
  return (
    <div>
      {!session ? (
        <>
          <h1>Please sign in</h1>
          <DynamicLoginForm />
        </>
      ) : (
        <DynamicClientSideRedirect />
      )}
    </div>
  );
}
