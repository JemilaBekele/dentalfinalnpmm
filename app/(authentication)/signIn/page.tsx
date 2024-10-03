
import dynamic from 'next/dynamic';

// Dynamically import components
const DynamicLoginForm = dynamic(() => import('@/app/components/Login'), {
  ssr: false, // Disable server-side rendering for this component
});



export default async function SignInPage() {
 

  // Return either LoginForm or ClientSideRedirect based on session state
  return (
    <div>
     
        <>
          
          <DynamicLoginForm />
        </>
    
    </div>
  );
}
