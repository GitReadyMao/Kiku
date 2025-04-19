import { useState } from "react";
import { useRouter } from "next/router"; // Use Next.js router
import Button from "react-bootstrap/Button";

export interface Registration {
  className?: string | undefined;
}

const RegistrationButton: React.FC<Registration> = ({ className }) => {
  const [error, setError] = useState("");
  const router = useRouter(); // Router used by Next.js, not react

  const registrationPage = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    router.push("/register")
  };

  return (
      <Button variant="secondary" onClick={registrationPage}>
        Register
      </Button>
  );
  
};

export default RegistrationButton;