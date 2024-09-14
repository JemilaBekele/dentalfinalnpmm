
"use client"; 
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const ClientSideRedirect: React.FC = () => {
  const { data: session, status } = useSession();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);


  useEffect(() => {
    if (status === "loading") return; // Wait for the session to load

    if (!session) {
      setRedirectUrl('/signIn');
    } else {
    
      const userRole = session.user?.role;
      switch (userRole) {
        case 'admin':
          setRedirectUrl('/admin');
          break;
        case 'doctor':
          setRedirectUrl('/doctor');
          break;
        case 'reception':
          setRedirectUrl('/reception');
          break;
        default:
          setRedirectUrl('/unauthorized');
      }
    }
  }, [session, status]);

  // Use effect to redirect on the client side
  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  return null; // Render nothing while redirecting
};

export default ClientSideRedirect;
