
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { StudentCheckInModal } from "./StudentCheckInModal";

export const StudentCheckInButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="bg-bjj-red hover:bg-bjj-red/90 text-white shadow-lg whitespace-nowrap"
        size="lg"
      >
        <CheckCircle className="h-5 w-5 mr-2" />
        Check In to Class
      </Button>

      <StudentCheckInModal 
        open={showModal} 
        onOpenChange={setShowModal}
      />
    </>
  );
};
