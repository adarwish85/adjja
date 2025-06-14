
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
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-bjj-red hover:bg-bjj-red/90 shadow-lg lg:relative lg:bottom-auto lg:right-auto lg:h-auto lg:w-auto lg:rounded-md"
        size="lg"
      >
        <CheckCircle className="h-6 w-6 lg:mr-2" />
        <span className="hidden lg:inline">Check In</span>
      </Button>

      <StudentCheckInModal 
        open={showModal} 
        onOpenChange={setShowModal}
      />
    </>
  );
};
